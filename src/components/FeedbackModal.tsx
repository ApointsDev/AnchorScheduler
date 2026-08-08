/**
 * FeedbackModal - 用户反馈 / 举报提交模态框（RPT-001）
 * 支持反馈（意见 / Bug / 建议）与举报两种类型
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { submitReport, type ReportType } from "../services/api";
import "../styles/Feedback.css";

const FEEDBACK_CATEGORIES = [
    "bug",
    "feature",
    "performance",
    "other",
] as const;

const REPORT_CATEGORIES = [
    "spam",
    "abuse",
    "harassment",
    "illegal",
    "other",
] as const;

export default function FeedbackModal({
    isOpen,
    onClose,
    initialType = "feedback",
}: {
    isOpen: boolean;
    onClose: () => void;
    initialType?: ReportType;
}) {
    const { t } = useTranslation();
    const [type, setType] = useState<ReportType>(initialType);
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [targetId, setTargetId] = useState("");
    const [contact, setContact] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const categories =
        type === "report" ? REPORT_CATEGORIES : FEEDBACK_CATEGORIES;

    const handleSubmit = async () => {
        setError("");
        setSuccess(false);
        if (content.trim().length < 5) {
            setError(t("feedback.contentTooShort"));
            return;
        }
        setSubmitting(true);
        try {
            await submitReport({
                type,
                category: category || null,
                targetId: type === "report" ? targetId.trim() || null : null,
                content: content.trim(),
                contact: contact.trim() || null,
            });
            setSuccess(true);
            setContent("");
            setCategory("");
            setTargetId("");
            setContact("");
        } catch (e) {
            setError(
                e instanceof Error ? e.message : t("feedback.submitFailed"),
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (submitting) return;
        setError("");
        setSuccess(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t("feedback.title")}
            closeOnOverlayClick={!submitting}
        >
            <div className="feedback-form">
                {success ? (
                    <div className="feedback-success">
                        <div className="feedback-success-icon">✓</div>
                        <p>{t("feedback.successMessage")}</p>
                        <Button onClick={handleClose}>
                            {t("common.close")}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="feedback-field">
                            <label>{t("feedback.type")}</label>
                            <div className="feedback-type-toggle">
                                <button
                                    type="button"
                                    className={`feedback-type-btn ${type === "feedback" ? "active" : ""}`}
                                    onClick={() => setType("feedback")}
                                >
                                    {t("feedback.feedback")}
                                </button>
                                <button
                                    type="button"
                                    className={`feedback-type-btn ${type === "report" ? "active" : ""}`}
                                    onClick={() => setType("report")}
                                >
                                    {t("feedback.report")}
                                </button>
                            </div>
                        </div>

                        <div className="feedback-field">
                            <label>
                                {t("feedback.category")}{" "}
                                <span className="feedback-optional">
                                    {t("common.optional")}
                                </span>
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">
                                    {t("feedback.selectCategory")}
                                </option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {t(`feedback.categories.${c}`)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="feedback-field">
                            <label>
                                {t("feedback.content")}{" "}
                                <span className="feedback-required">*</span>
                            </label>
                            <textarea
                                rows={5}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={t("feedback.contentPlaceholder")}
                                maxLength={5000}
                            />
                        </div>

                        {type === "report" && (
                            <div className="feedback-field">
                                <label>
                                    {t("feedback.targetId")}{" "}
                                    <span className="feedback-optional">
                                        {t("common.optional")}
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={targetId}
                                    onChange={(e) =>
                                        setTargetId(e.target.value)
                                    }
                                    placeholder={t("feedback.targetPlaceholder")}
                                />
                            </div>
                        )}

                        <div className="feedback-field">
                            <label>
                                {t("feedback.contact")}{" "}
                                <span className="feedback-optional">
                                    {t("common.optional")}
                                </span>
                            </label>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder={t("feedback.contactPlaceholder")}
                            />
                        </div>

                        {error && <div className="feedback-error">{error}</div>}

                        <div className="feedback-footer">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={submitting}
                            >
                                {t("common.cancel")}
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting
                                    ? t("common.saving")
                                    : t("feedback.submit")}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
