import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    approveQueueItem,
    rejectQueueItem,
    ScheduleConflictError,
    type ScheduleQueueItem,
    type Task,
} from "../../services/api";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import QueueTaskModal from "../Schedule/QueueTaskModal";
import {
    Check,
    X,
    Clock,
    MapPin,
    Loader2,
    Pencil,
    AlertTriangle,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface Props {
    items: ScheduleQueueItem[];
    onItemsChange: () => void;
}

const InlineScheduleApproval: React.FC<Props> = ({ items, onItemsChange }) => {
    const { t } = useTranslation();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
    const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
    const [conflictModal, setConflictModal] = useState<{
        queueId: string;
        conflicts: Task[];
    } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<ScheduleQueueItem | null>(null);
    const [approvingAll, setApprovingAll] = useState(false);
    const [approveAllResult, setApproveAllResult] = useState<{
        approved: number;
        skipped: number;
        failed: number;
    } | null>(null);
    const [showConflictStrategyModal, setShowConflictStrategyModal] =
        useState(false);
    const batchRef = useRef<{
        items: ScheduleQueueItem[];
        strategy: "skip" | "ask";
        approved: number;
        skipped: number;
        failed: number;
    } | null>(null);

    const handleApprove = async (queueId: string) => {
        setLoadingId(queueId);
        setErrorMsg(null);
        try {
            await approveQueueItem(queueId);
            setApprovedIds((prev) => new Set(prev).add(queueId));
            onItemsChange();
        } catch (e: any) {
            if (e instanceof ScheduleConflictError) {
                setConflictModal({
                    queueId,
                    conflicts: e.conflicts || [],
                });
            } else {
                setErrorMsg(
                    e instanceof Error
                        ? e.message
                        : t("schedule.approveFailed"),
                );
            }
        } finally {
            setLoadingId(null);
        }
    };

    const handleApproveConflict = async () => {
        if (!conflictModal) return;
        setLoadingId(conflictModal.queueId);
        try {
            await approveQueueItem(conflictModal.queueId, {
                allowConflict: true,
            });
            setApprovedIds((prev) => new Set(prev).add(conflictModal.queueId));
            setConflictModal(null);
            onItemsChange();
        } catch (e: any) {
            setErrorMsg(
                e instanceof Error ? e.message : t("schedule.approveFailed"),
            );
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (queueId: string) => {
        setLoadingId(queueId);
        setErrorMsg(null);
        try {
            await rejectQueueItem(queueId);
            setRejectedIds((prev) => new Set(prev).add(queueId));
            onItemsChange();
        } catch (e: any) {
            setErrorMsg(
                e instanceof Error ? e.message : t("schedule.rejectFailed"),
            );
        } finally {
            setLoadingId(null);
        }
    };

    // ── 一键审批 ─────────────────────────────────────────

    const handleApproveAll = () => {
        const pending = visibleItems.filter(
            (item) => !approvedIds.has(item.id) && !rejectedIds.has(item.id),
        );
        if (pending.length === 0) return;
        setShowConflictStrategyModal(true);
    };

    const startBatchApprove = (strategy: "skip" | "ask") => {
        setShowConflictStrategyModal(false);
        setApprovingAll(true);
        setErrorMsg(null);
        setApproveAllResult(null);

        const pending = visibleItems.filter(
            (item) => !approvedIds.has(item.id) && !rejectedIds.has(item.id),
        );

        batchRef.current = {
            items: [...pending],
            strategy,
            approved: 0,
            skipped: 0,
            failed: 0,
        };
        processNextBatchItem();
    };

    const processNextBatchItem = () => {
        const batch = batchRef.current;
        if (!batch) return;

        const next = batch.items.find(
            (item) => !approvedIds.has(item.id) && !rejectedIds.has(item.id),
        );
        if (!next) {
            setApproveAllResult({
                approved: batch.approved,
                skipped: batch.skipped,
                failed: batch.failed,
            });
            setApprovingAll(false);
            batchRef.current = null;
            onItemsChange();
            return;
        }

        approveQueueItem(next.id)
            .then(() => {
                setApprovedIds((prev) => new Set(prev).add(next.id));
                batch.approved++;
                processNextBatchItem();
            })
            .catch((e: any) => {
                if (e instanceof ScheduleConflictError) {
                    if (batch.strategy === "ask") {
                        setConflictModal({
                            queueId: next.id,
                            conflicts: e.conflicts || [],
                        });
                        return;
                    }
                    batch.skipped++;
                } else {
                    batch.failed++;
                }
                processNextBatchItem();
            });
    };

    const handleBatchConflictApprove = async () => {
        if (!conflictModal) return;
        const batch = batchRef.current;
        const queueId = conflictModal.queueId;
        setConflictModal(null);

        try {
            await approveQueueItem(queueId, { allowConflict: true });
            setApprovedIds((prev) => new Set(prev).add(queueId));
            if (batch) batch.approved++;
        } catch {
            if (batch) batch.failed++;
        }
        processNextBatchItem();
    };

    const handleBatchConflictSkip = () => {
        const batch = batchRef.current;
        if (batch) batch.skipped++;
        setConflictModal(null);
        processNextBatchItem();
    };

    // ── 格式化 ────────────────────────────────────────────

    const formatTime = (iso: string) => {
        try {
            return format(parseISO(iso), "MM/dd HH:mm");
        } catch {
            return iso;
        }
    };

    const visibleItems = items.filter(
        (item) => !rejectedIds.has(item.id) && !approvedIds.has(item.id),
    );
    const allResolved = items.length > 0 && visibleItems.length === 0;

    const isBatchConflict = batchRef.current !== null && conflictModal !== null;

    if (allResolved) {
        return (
            <div className="inline-approval-done">
                <Check size={14} /> {t("schedule.allProcessed")}
            </div>
        );
    }

    return (
        <div className="inline-schedule-approval">
            <div className="inline-approval-header">
                <span>
                    {t("schedule.aiRecognized", { count: items.length })}
                </span>
                {visibleItems.length > 1 && (
                    <Button
                        size="sm"
                        onClick={handleApproveAll}
                        disabled={approvingAll || !!loadingId}
                    >
                        {approvingAll ? (
                            <Loader2 size={14} className="spin" />
                        ) : (
                            <Check size={14} />
                        )}
                        {approvingAll
                            ? t("schedule.approving")
                            : t("schedule.approveAll")}
                    </Button>
                )}
            </div>

            {approveAllResult && (
                <div className="inline-approval-result">
                    {approveAllResult.approved > 0 && (
                        <span className="result-approved">
                            <Check size={12} /> {approveAllResult.approved}{" "}
                            {t("schedule.approved")}
                        </span>
                    )}
                    {approveAllResult.skipped > 0 && (
                        <span className="result-skipped">
                            {approveAllResult.skipped}{" "}
                            {t("schedule.skippedConflict")}
                        </span>
                    )}
                    {approveAllResult.failed > 0 && (
                        <span className="result-failed">
                            {approveAllResult.failed} {t("schedule.failed")}
                        </span>
                    )}
                </div>
            )}

            {errorMsg && (
                <div className="inline-approval-error">{errorMsg}</div>
            )}

            {visibleItems.map((item) => {
                let parsed: any = null;
                try {
                    parsed =
                        typeof item.rawRequest === "string"
                            ? JSON.parse(item.rawRequest)
                            : item.rawRequest;
                } catch {
                    parsed = null;
                }
                const args = parsed?.args || parsed || {};
                const name =
                    args.name || args.title || t("schedule.unnamedSchedule");
                const startTime = args.startTime || args.start || "";
                const endTime = args.endTime || args.end || "";
                const location = args.location || args.place || "";

                const isProcessing = loadingId === item.id;

                return (
                    <div key={item.id} className="inline-approval-card">
                        <div className="inline-approval-card-body">
                            <div className="inline-approval-card-name">
                                {name}
                            </div>
                            <div className="inline-approval-card-time">
                                <Clock size={12} />
                                {startTime && endTime
                                    ? `${formatTime(startTime)} - ${formatTime(endTime)}`
                                    : startTime ||
                                      endTime ||
                                      t("schedule.timePending")}
                            </div>
                            {location && (
                                <div className="inline-approval-card-location">
                                    <MapPin size={12} />
                                    {location}
                                </div>
                            )}
                        </div>
                        <div className="inline-approval-card-actions">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditItem(item)}
                                disabled={!!loadingId}
                            >
                                <Pencil size={14} />
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => handleApprove(item.id)}
                                disabled={!!loadingId}
                            >
                                {isProcessing ? (
                                    <Loader2 size={14} className="spin" />
                                ) : (
                                    <Check size={14} />
                                )}
                                {t("schedule.approve")}
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleReject(item.id)}
                                disabled={!!loadingId}
                            >
                                <X size={14} />
                                {t("schedule.reject")}
                            </Button>
                        </div>
                    </div>
                );
            })}

            {/* 冲突策略选择弹窗 */}
            <Modal
                isOpen={showConflictStrategyModal}
                onClose={() => setShowConflictStrategyModal(false)}
                title={t("schedule.conflictStrategyTitle")}
                footer={
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            variant="ghost"
                            onClick={() => setShowConflictStrategyModal(false)}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => startBatchApprove("ask")}
                        >
                            {t("schedule.askPerConflict")}
                        </Button>
                        <Button onClick={() => startBatchApprove("skip")}>
                            {t("schedule.skipConflicts")}
                        </Button>
                    </div>
                }
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                    }}
                >
                    <AlertTriangle
                        size={20}
                        style={{
                            color: "var(--color-warning-600)",
                            flexShrink: 0,
                            marginTop: 2,
                        }}
                    />
                    <div>
                        <p
                            style={{
                                margin: "0 0 8px",
                                color: "var(--color-text-dark)",
                                fontWeight: 500,
                            }}
                        >
                            {t("schedule.conflictStrategyDesc")}
                        </p>
                        <ul
                            style={{
                                margin: 0,
                                paddingLeft: 18,
                                color: "var(--color-text-medium)",
                                fontSize: "0.85rem",
                                lineHeight: 1.8,
                            }}
                        >
                            <li>{t("schedule.conflictStrategySkipDesc")}</li>
                            <li>{t("schedule.conflictStrategyAskDesc")}</li>
                        </ul>
                    </div>
                </div>
            </Modal>

            {/* 冲突详情弹窗（单项审批 / 批量逐个询问） */}
            <Modal
                isOpen={!!conflictModal && !showConflictStrategyModal}
                onClose={() => {
                    if (isBatchConflict) {
                        handleBatchConflictSkip();
                    } else {
                        setConflictModal(null);
                    }
                }}
                title={t("schedule.conflict")}
                footer={
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            variant="ghost"
                            onClick={() => {
                                if (isBatchConflict) {
                                    handleBatchConflictSkip();
                                } else {
                                    setConflictModal(null);
                                }
                            }}
                        >
                            {t("schedule.skipForNow")}
                        </Button>
                        <Button
                            onClick={() => {
                                if (isBatchConflict) {
                                    handleBatchConflictApprove();
                                } else {
                                    handleApproveConflict();
                                }
                            }}
                        >
                            {t("schedule.addAnyway")}
                        </Button>
                    </div>
                }
            >
                <p
                    style={{
                        marginBottom: "1rem",
                        color: "var(--color-text-medium)",
                    }}
                >
                    {t("schedule.conflictMessage")}
                </p>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {(conflictModal?.conflicts || []).map((task) => (
                        <div
                            key={task.id}
                            style={{
                                padding: "10px",
                                marginBottom: "8px",
                                backgroundColor: "var(--color-danger-50)",
                                border: "1px solid var(--color-danger-200)",
                                borderRadius: "6px",
                                fontSize: "0.9rem",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    color: "var(--color-danger-600)",
                                }}
                            >
                                {task.name}
                            </div>
                            <div
                                style={{
                                    color: "var(--color-danger-800)",
                                    fontSize: "0.85rem",
                                    marginTop: "4px",
                                }}
                            >
                                {task.startTime} - {task.endTime}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>

            <QueueTaskModal
                isOpen={!!editItem}
                onClose={() => setEditItem(null)}
                item={editItem}
                onAdded={() => {
                    setEditItem(null);
                    onItemsChange();
                }}
            />
        </div>
    );
};

export default InlineScheduleApproval;
