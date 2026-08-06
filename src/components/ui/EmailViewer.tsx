import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { getRawEmail, type RawEmail } from "../../services/api";

interface EmailViewerProps {
    emailId: string;
    /** 从日程请求中提取的邮件元信息（避免请求接口） */
    emailMeta?: {
        subject: string;
        from?: { name: string; address: string };
        receivedAt: string;
    };
}

const EmailViewer: React.FC<EmailViewerProps> = ({ emailId, emailMeta }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState<RawEmail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleOpen = async () => {
        setOpen(true);
        if (email) return; // already loaded
        setLoading(true);
        setError("");
        try {
            const data = await getRawEmail(emailId);
            setEmail(data);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : t("email.loadFailed"));
        } finally {
            setLoading(false);
        }
    };

    const from = email?.from || emailMeta?.from;
    const subject =
        email?.subject || emailMeta?.subject || t("email.noSubject");

    return (
        <>
            <Button variant="ghost" onClick={handleOpen}>
                {t("email.viewEmail")}
            </Button>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title={t("email.originalEmail")}
            >
                {loading ? (
                    <p>{t("common.loading")}</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : (
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginBottom: "1rem",
                            }}
                        >
                            <tbody>
                                <tr>
                                    <td
                                        style={{
                                            fontWeight: "bold",
                                            whiteSpace: "nowrap",
                                            paddingRight: 8,
                                            verticalAlign: "top",
                                            color: "#666",
                                        }}
                                    >
                                        {t("email.subject")}
                                    </td>
                                    <td>{subject}</td>
                                </tr>
                                {from && (
                                    <tr>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                paddingRight: 8,
                                                verticalAlign: "top",
                                                color: "#666",
                                            }}
                                        >
                                            {t("email.sender")}
                                        </td>
                                        <td>
                                            {from.name
                                                ? `${from.name} <${from.address}>`
                                                : from.address}
                                        </td>
                                    </tr>
                                )}
                                {(email?.receivedAt ||
                                    emailMeta?.receivedAt) && (
                                    <tr>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                paddingRight: 8,
                                                verticalAlign: "top",
                                                color: "#666",
                                            }}
                                        >
                                            {t("email.time")}
                                        </td>
                                        <td>
                                            {email?.receivedAt ||
                                                emailMeta?.receivedAt}
                                        </td>
                                    </tr>
                                )}
                                {email?.source && (
                                    <tr>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                paddingRight: 8,
                                                verticalAlign: "top",
                                                color: "#666",
                                            }}
                                        >
                                            {t("email.source")}
                                        </td>
                                        <td>{email.source}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <hr
                            style={{
                                margin: "12px 0",
                                border: "none",
                                borderTop: "1px solid #eee",
                            }}
                        />
                        {email ? (
                            email.htmlBody ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: email.htmlBody,
                                    }}
                                    style={{
                                        fontSize: "0.9rem",
                                        lineHeight: 1.6,
                                        color: "#333",
                                    }}
                                />
                            ) : (
                                <pre
                                    style={{
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        fontFamily: "inherit",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.6,
                                        color: "#333",
                                        margin: 0,
                                    }}
                                >
                                    {email.body || t("email.noBody")}
                                </pre>
                            )
                        ) : (
                            <p style={{ color: "#999" }}>
                                {t("email.noContent")}
                            </p>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
};

export default EmailViewer;
