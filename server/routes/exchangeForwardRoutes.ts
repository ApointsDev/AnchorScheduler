// Exchange 邮箱转发绑定路由
//
// 背景：学校更改了 Exchange 直接访问权限，原 OAuth/EWS 绑定方式已废弃。
// 新方案（引导式）：
//   1) 用户填写西交利物浦大学邮箱（@xjtlu.edu.cn）
//   2) 系统通过 CAF SMTP（smtp.apoints.email，XOAUTH2）向该邮箱发送一封带验证码的测试邮件
//   3) 引导用户在 XJTLU 邮箱(Outlook)中配置「转发到自己的 @apoints.email」
//   4) 被转发的测试邮件会出现在 @apoints.email 收件箱（应用已通过 IMAP 读取）
//   5) 系统在收件箱中检索到验证码即确认转发生效，完成绑定
import express from "express";
import nodemailer from "nodemailer";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { ensureCafTokenValid } from "../Services/cafAuth.js";
import { ImapClient } from "../Services/imapClient.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

interface PendingExchange {
  xjtluEmail: string;
  code: string;
  sentAt: number;
}

// 待验证的转发绑定（内存态；该流程为短期操作，服务重启后用户重新发送即可）
const pendingExchanges = new Map<string, PendingExchange>();

function isValidXjtluEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+\-]+@(?:[A-Za-z0-9-]+\.)*xjtlu\.edu\.cn$/i.test(
    email.trim(),
  );
}

function generateVerifyCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** 构建 CAF SMTP 发信 transport（XOAUTH2） */
function buildCafSmtpTransport(user: User, cafToken: string) {
  const from = user.email || user.ImapEmail;
  if (!from) return null;
  return nodemailer.createTransport({
    host: process.env.CAF_SMTP_HOST || "smtp.apoints.email",
    port: Number(process.env.CAF_SMTP_PORT) || 587,
    secure: false,
    auth: {
      type: "OAuth2",
      user: from,
      accessToken: cafToken,
    },
  });
}

/** 构建临时 IMAP 配置（与 intervals.ts 的启动逻辑保持一致） */
function buildImapConfig(
  user: User,
  cafConfig: any,
  cafToken: string | null,
) {
  const hasImap =
    user.ImapBinded &&
    user.ImapEmail &&
    (user.ImapHost || cafConfig.imapHost);
  if (!hasImap) return null;

  const useOAuth = !!user.CAFAccessToken && !!cafToken;
  return {
    host: user.ImapHost || cafConfig.imapHost,
    port: user.ImapPort || cafConfig.imapPort,
    tls: user.ImapTls ?? true,
    username: user.ImapEmail!,
    password: useOAuth ? cafToken! : user.ImapPassword || "",
    useOAuth,
  };
}

/**
 * 在用户收件箱（@apoints.email）中检索包含验证码的邮件。
 * 优先复用常驻 imapClient；没有则临时建立连接。
 */
async function scanInboxForCode(
  user: User,
  code: string,
  cafConfig: any,
): Promise<boolean> {
  const matches = (emails: any[]) =>
    emails.some(
      (e: any) =>
        (e.subject || "").includes(code) || (e.body || "").includes(code),
    );

  // 优先使用常驻 IMAP 连接
  if (user.imapClient) {
    try {
      const emails = await (user.imapClient as any).findEmails(60);
      return matches(emails);
    } catch (err: any) {
      logger.warn(
        `exchange-forward: 常驻 IMAP 检索失败，尝试临时连接: ${err.message || String(err)}`,
      );
    }
  }

  // 临时连接
  const token = user.CAFAccessToken
    ? await ensureCafTokenValid(cafConfig, user)
    : null;
  const config = buildImapConfig(user, cafConfig, token);
  if (!config) return false;

  const client = new ImapClient(config);
  try {
    const emails = await client.findEmails(60);
    return matches(emails);
  } catch (err: any) {
    logger.error(
      `exchange-forward: 临时 IMAP 检索失败: ${err.message || String(err)}`,
    );
    return false;
  } finally {
    try {
      await client.close();
    } catch {
      /* ignore */
    }
  }
}

export function initializeExchangeForwardRoutes(
  router: express.Router,
  authenticateToken: AuthMiddleware,
  cafConfig: any,
) {
  // ── 发送测试邮件并开启待验证状态 ────────────────────────
  router.post(
    "/exchange-forward/start",
    authenticateToken,
    async (req: any, res: any) => {
      const user = req.user as User;
      const { xjtluEmail } = req.body || {};

      const email = typeof xjtluEmail === "string" ? xjtluEmail.trim() : "";
      if (!isValidXjtluEmail(email)) {
        return res.status(400).json({
          error: "请输入有效的西交利物浦大学邮箱（@xjtlu.edu.cn）",
        });
      }

      // 需要 IMAP 收件（转发目标 = @apoints.email）
      if (!user.ImapBinded || !user.ImapEmail) {
        return res.status(400).json({
          error: "请先在设置页绑定收件邮箱（@apoints.email），用于接收被转发的邮件",
        });
      }

      // 确保有可用的发信令牌（CAF XOAUTH2）
      const cafToken = user.CAFAccessToken
        ? await ensureCafTokenValid(cafConfig, user)
        : null;
      if (!cafToken) {
        return res.status(400).json({
          error: "发信凭据不可用，请重新登录以刷新认证令牌",
        });
      }

      const transport = buildCafSmtpTransport(user, cafToken);
      if (!transport) {
        return res.status(400).json({ error: "发信配置不可用" });
      }

      const code = generateVerifyCode();
      const forwardTarget = user.ImapEmail || user.email;
      try {
        await transport.sendMail({
          from: `时锚 <${forwardTarget}>`,
          to: email,
          subject: `【时锚】Exchange 转发绑定验证码：${code}`,
          text:
            `这是一封由「时锚」自动发送的验证邮件，用于确认你的西交利物浦邮箱转发配置。\n\n` +
            `验证码：${code}\n\n` +
            `请按以下步骤操作：\n` +
            `1. 登录你的西交利物浦邮箱（Outlook）并进入设置；\n` +
            `2. 在「邮件 → 转发」中，将收到的邮件转发到：${forwardTarget}\n` +
            `3. 保存后回到「时锚」，点击「检查绑定状态」。\n\n` +
            `若转发生效，这封邮件会出现在 ${forwardTarget} 的收件箱中，系统即可自动确认。`,
        });
      } catch (err: any) {
        logger.error(
          `exchange-forward: 测试邮件发送失败 (${user.id}): ${err.message || String(err)}`,
        );
        return res
          .status(500)
          .json({ error: "测试邮件发送失败，请稍后重试或检查网络" });
      }

      pendingExchanges.set(user.id, {
        xjtluEmail: email,
        code,
        sentAt: Date.now(),
      });
      res.json({ sent: true, code, forwardTarget });
    },
  );

  // ── 检查绑定状态（检索被转发的测试邮件）─────────────────
  router.post(
    "/exchange-forward/check",
    authenticateToken,
    async (req: any, res: any) => {
      const user = req.user as User;
      const pending = pendingExchanges.get(user.id);
      if (!pending) {
        return res.status(400).json({
          error: "未找到待验证的绑定请求，请重新发送测试邮件",
        });
      }

      let confirmed = false;
      try {
        confirmed = await scanInboxForCode(user, pending.code, cafConfig);
      } catch (err: any) {
        logger.error(
          `exchange-forward: 检查转发状态失败 (${user.id}): ${err.message || String(err)}`,
        );
      }

      if (confirmed) {
        user.ExchangeBinded = true;
        user.XJTLUaccount = pending.xjtluEmail;
        // 清除废弃的 OAuth/EWS 凭据
        user.ExchangeAccessToken = undefined;
        user.ExchangeRefreshToken = undefined;
        user.ExchangeTokenExpiresAt = undefined;
        await dbService.updateUser(user);
        pendingExchanges.delete(user.id);
        logger.info(
          `exchange-forward: 用户 ${user.id} 已通过转发确认绑定 Exchange (${pending.xjtluEmail})`,
        );
        return res.json({ confirmed: true, email: pending.xjtluEmail });
      }

      return res.json({ confirmed: false });
    },
  );

  // ── 取消待验证状态 ──────────────────────────────────────
  router.post(
    "/exchange-forward/cancel",
    authenticateToken,
    async (req: any, res: any) => {
      const user = req.user as User;
      pendingExchanges.delete(user.id);
      res.json({ cancelled: true });
    },
  );
}
