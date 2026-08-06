/**
 * 将 Schedule 用户凭据 upsert 到爬虫 MySQL crawler_accounts。
 * 依赖 mysql2；若未配置 CRAWLER_MYSQL_* 则抛错。
 */
import mysql from "mysql2/promise";
import { logger } from "../../Utils/logger.js";

function mysqlConfig() {
    const host = process.env.CRAWLER_MYSQL_HOST || "127.0.0.1";
    const port = Number(process.env.CRAWLER_MYSQL_PORT || 3306);
    const user = process.env.CRAWLER_MYSQL_USER || "chaoxing";
    const password =
        process.env.CRAWLER_MYSQL_PASSWORD ||
        process.env.CHAOXING_MYSQL_PASSWORD ||
        "";
    const database = process.env.CRAWLER_MYSQL_DATABASE || "chaoxing";
    if (!password) {
        throw new Error(
            "CRAWLER_MYSQL_PASSWORD is not set; cannot upsert crawler credentials",
        );
    }
    return { host, port, user, password, database };
}

export async function upsertCrawlerAccount(opts: {
    accountId: string;
    username: string;
    password: string;
    enabled?: boolean;
}): Promise<void> {
    const cfg = mysqlConfig();
    const conn = await mysql.createConnection(cfg);
    try {
        await conn.execute(
            `INSERT INTO crawler_accounts (account_id, username, password, enabled)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               username = VALUES(username),
               password = VALUES(password),
               enabled = VALUES(enabled)`,
            [
                opts.accountId,
                opts.username,
                opts.password,
                opts.enabled === false ? 0 : 1,
            ],
        );
        logger.info(
            `Crawler account upserted: ${opts.accountId} enabled=${opts.enabled !== false}`,
        );
    } finally {
        await conn.end();
    }
}

export async function disableCrawlerAccount(accountId: string): Promise<void> {
    const cfg = mysqlConfig();
    const conn = await mysql.createConnection(cfg);
    try {
        await conn.execute(
            `UPDATE crawler_accounts SET enabled = 0 WHERE account_id = ?`,
            [accountId],
        );
    } finally {
        await conn.end();
    }
}
