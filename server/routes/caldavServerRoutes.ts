/**
 * CalDAV Server Express Routes
 * Mounts CalDAV protocol handling as Express middleware.
 * Supports HTTP Basic Auth and JWT Bearer token authentication.
 */

import express from "express";
import bcrypt from "bcryptjs";
import type { User } from "../index.js";
import { dbService } from "../Services/dbService.js";
import {
    handleCalDavRequest,
    type CalDavServerConfig,
} from "../Services/calendar/CalDavServer.js";
import { logger } from "../Utils/logger.js";

// ── Auth helpers ───────────────────────────────────────────────────

async function authenticateBasicAuth(
    authorizationHeader: string,
): Promise<User | null> {
    try {
        const base64 = authorizationHeader.split(" ")[1];
        if (!base64) return null;

        const decoded = Buffer.from(base64, "base64").toString("utf8");
        const colonIdx = decoded.indexOf(":");
        if (colonIdx < 0) return null;

        const username = decoded.slice(0, colonIdx);
        const password = decoded.slice(colonIdx + 1);

        // Try to find user by email (username = email)
        const user = await dbService.getUserByEmail(username);
        if (!user) return null;

        // Check CalDAV server is enabled on this user
        if (!(user as any).CalDavServerEnabled) {
            return null;
        }

        // Check CalDAV-specific password first (auto-bind token)
        if (
            (user as any).CalDavPassword &&
            password === (user as any).CalDavPassword
        ) {
            return user;
        }

        // Check password
        if (user.passwordHash) {
            const valid = await bcrypt.compare(password, user.passwordHash);
            if (!valid) return null;
        } else {
            // Fallback: if no passwordHash, check XJTLU password (legacy)
            if (user.XJTLUPassword && user.XJTLUPassword !== password)
                return null;
            if (!user.XJTLUPassword && !user.passwordHash) return null;
        }

        return user;
    } catch {
        return null;
    }
}

async function authenticateBearerToken(
    authorizationHeader: string,
): Promise<User | null> {
    // Re-use the JWT verification from the main server
    // This is handled at the caldavServerRoutes init level
    return null; // Placeholder - actual auth done in init
}

// ── Route factory ──────────────────────────────────────────────────

export function createCalDavServerRouter(
    config: CalDavServerConfig,
    jwtVerify?: (token: string) => any,
    userLookup?: (sub: string) => Promise<User | undefined>,
    getClientProfile?: (user: User) => string | undefined,
) {
    const router = express.Router();

    // Raw body parser for CalDAV - use text/raw for XML and ICS bodies
    router.use((req: any, res: any, next: any) => {
        // Skip body parsing for normal requests, handle manually
        if (
            ["PUT", "PROPFIND", "REPORT", "MKCALENDAR", "MKCOL"].includes(
                req.method.toUpperCase(),
            )
        ) {
            const chunks: Buffer[] = [];
            req.on("data", (chunk: Buffer) => chunks.push(chunk));
            req.on("end", () => {
                req.rawBody = Buffer.concat(chunks).toString("utf8");
                next();
            });
            req.on("error", () => {
                res.status(400).end();
            });
        } else {
            next();
        }
    });

    // ── Authentication middleware ──────────────────────────────────

    const authMiddleware = async (req: any, res: any, next: any) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.setHeader("WWW-Authenticate", 'Basic realm="CalDAV"');
            return res.status(401).end();
        }

        let user: User | null = null;

        if (authHeader.startsWith("Basic ")) {
            user = await authenticateBasicAuth(authHeader);
        } else if (
            authHeader.startsWith("Bearer ") &&
            jwtVerify &&
            userLookup
        ) {
            try {
                const token = authHeader.split(" ")[1];
                const decoded = jwtVerify(token);
                if (decoded) {
                    const u = await userLookup(decoded.sub);
                    user = u || null;
                }
            } catch {
                // fall through
            }
        }

        if (!user) {
            res.setHeader("WWW-Authenticate", 'Basic realm="CalDAV"');
            return res.status(401).end();
        }

        req.caldavUser = user;
        next();
    };

    // ── Well-known redirect ────────────────────────────────────────

    router.get("/.well-known/caldav", (req: any, res: any) => {
        // Redirect CalDAV clients to the server root where PROPFIND with current-user-principal will guide discovery
        res.redirect(301, `${config.baseUrl}/`);
    });

    // ── Main CalDAV handler (all methods, all paths) ───────────────

    router.all("/*", authMiddleware, async (req: any, res: any) => {
        try {
            const user: User = req.caldavUser;
            const method = req.method;
            const path = req.path;
            const depth = (req.headers.depth as string) || "0";
            const body = (req as any).rawBody || req.body || "";

            const response = await handleCalDavRequest(
                {
                    user,
                    method,
                    path,
                    depth,
                    body: typeof body === "string" ? body : "",
                },
                config,
            );

            // Set response headers
            if (response.headers) {
                for (const [key, value] of Object.entries(response.headers)) {
                    res.setHeader(key, value);
                }
            }

            // For 207 Multi-Status, ensure proper content type
            if (response.status === 207) {
                res.setHeader("Content-Type", "text/xml; charset=utf-8");
            }

            res.status(response.status);

            if (response.body) {
                res.send(response.body);
            } else {
                res.end();
            }
        } catch (error: any) {
            logger.error("CalDAV server error:", error);
            res.status(500).end();
        }
    });

    return router;
}

// ── Public helper to initialize with main server context ───────────

export interface CalDavServerInitOptions {
    app: express.Application;
    baseUrl: string;
    jwtVerify: (token: string) => any;
    userLookup: (sub: string) => Promise<User | undefined>;
}

export function initializeCalDavServer(options: CalDavServerInitOptions) {
    const config: CalDavServerConfig = {
        baseUrl: options.baseUrl,
    };

    const router = createCalDavServerRouter(
        config,
        options.jwtVerify,
        options.userLookup,
        (user: User) => (user as any).CalDavClientProfile || "auto",
    );

    // Mount at /caldav
    options.app.use("/caldav", router);

    logger.info(`CalDAV server mounted at ${options.baseUrl}`);
}
