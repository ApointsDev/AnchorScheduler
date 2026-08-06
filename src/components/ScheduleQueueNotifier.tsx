import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import {
    getToken,
    approveQueueItem,
    rejectQueueItem,
    ScheduleConflictError,
    type Task,
} from "../services/api";

interface QueuePayload {
    queueId: string;
    name?: string;
    startTime?: string;
    endTime?: string;
}

const ScheduleQueueNotifier: React.FC = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [payload, setPayload] = useState<QueuePayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [conflictModal, setConflictModal] = useState<{
        queueId: string;
        conflicts: Task[];
    } | null>(null);

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        let unsub: (() => void) | null = null;
        (async () => {
            const wsClient = (await import("../services/wsClient")).default;
            wsClient.connectIfNeeded(token);
            unsub = wsClient.subscribe("userLog", (data: any) => {
                try {
                    if (
                        data.log &&
                        data.log.type === "external_schedule_request"
                    ) {
                        setPayload(data.log.payload || null);
                        setOpen(true);
                    }
                } catch (e) {}
            });
        })();

        return () => {
            if (unsub) unsub();
        };
    }, []);

    const handleApprove = async () => {
        if (!payload) return;
        setLoading(true);
        try {
            await approveQueueItem(payload.queueId);
            setOpen(false);
        } catch (e: any) {
            if (e instanceof ScheduleConflictError) {
                setConflictModal({
                    queueId: payload.queueId,
                    conflicts: e.conflicts || [],
                });
            } else {
                console.error("Approve failed", e);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApproveConflict = async () => {
        if (!conflictModal) return;
        setLoading(true);
        try {
            await approveQueueItem(conflictModal.queueId, {
                allowConflict: true,
            });
            setConflictModal(null);
            setOpen(false);
        } catch (e: any) {
            console.error("Approve (allow conflict) failed", e);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!payload) return;
        setLoading(true);
        try {
            await rejectQueueItem(payload.queueId);
            setOpen(false);
        } catch (e: any) {
            console.error("Reject failed", e);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (iso?: string) => {
        if (!iso) return "";
        try {
            return new Date(iso).toLocaleString("zh-CN", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return iso;
        }
    };

    return (
        <>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title={t("schedule.externalRequest")}
            >
                {payload ? (
                    <div>
                        <p>
                            <strong>{t("schedule.requestTitle")}</strong>
                            {payload.name || t("schedule.unnamed")}
                        </p>
                        <p>
                            <strong>{t("schedule.startTime")}</strong>
                            {formatTime(payload.startTime) ||
                                t("schedule.unspecified")}
                        </p>
                        <p>
                            <strong>{t("schedule.endTime")}</strong>
                            {formatTime(payload.endTime) ||
                                t("schedule.unspecified")}
                        </p>
                        <div
                            style={{
                                marginTop: 20,
                                display: "flex",
                                gap: 8,
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                variant="ghost"
                                onClick={handleReject}
                                disabled={loading}
                            >
                                {t("schedule.reject")}
                            </Button>
                            <Button onClick={handleApprove} disabled={loading}>
                                {t("schedule.approveAndAdd")}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>{t("schedule.externalRequestReceived")}</div>
                )}
            </Modal>

            <Modal
                isOpen={!!conflictModal}
                onClose={() => setConflictModal(null)}
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
                            onClick={() => setConflictModal(null)}
                        >
                            {t("schedule.skipForNow")}
                        </Button>
                        <Button
                            onClick={handleApproveConflict}
                            disabled={loading}
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
                                backgroundColor: "#fff5f5",
                                border: "1px solid #feb2b2",
                                borderRadius: "6px",
                                fontSize: "0.9rem",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    color: "#c53030",
                                }}
                            >
                                {task.name}
                            </div>
                            <div
                                style={{
                                    color: "#742a2a",
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
        </>
    );
};

export default ScheduleQueueNotifier;
