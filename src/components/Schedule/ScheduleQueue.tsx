import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import ScheduleCard from "./ScheduleCard";
import {
    getScheduleQueue,
    approveQueueItem,
    rejectQueueItem,
    ScheduleConflictError,
    type Task,
} from "../../services/api";
import type { ScheduleQueueItem } from "../../services/api";
import QueueTaskModal from "./QueueTaskModal";
import EmailViewer from "../ui/EmailViewer";

const ScheduleQueue: React.FC = () => {
    const [items, setItems] = useState<ScheduleQueueItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<ScheduleQueueItem | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [errorModal, setErrorModal] = useState<{
        title: string;
        message: string;
    } | null>(null);
    const [conflictModal, setConflictModal] = useState<{
        queueId: string;
        conflicts: Task[];
    } | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getScheduleQueue();
            setItems(res.queue || []);
        } catch (e: any) {
            console.error("Failed to load queue", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleApprove = async (id: string) => {
        setActionLoading(true);
        try {
            await approveQueueItem(id);
            await load();
            setSelected(null);
        } catch (e: any) {
            console.error("Approve failed", e);
            if (e instanceof ScheduleConflictError) {
                setConflictModal({ queueId: id, conflicts: e.conflicts || [] });
            } else {
                setErrorModal({
                    title: "审批失败",
                    message: e instanceof Error ? e.message : "批准请求失败",
                });
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveAllowConflict = async () => {
        if (!conflictModal) return;
        setActionLoading(true);
        try {
            await approveQueueItem(conflictModal.queueId, {
                allowConflict: true,
            });
            await load();
            setSelected(null);
            setConflictModal(null);
        } catch (e: any) {
            console.error("Approve (allow conflict) failed", e);
            setErrorModal({
                title: "审批失败",
                message: e instanceof Error ? e.message : "批准请求失败",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoading(true);
        try {
            await rejectQueueItem(id);
            await load();
            setSelected(null);
        } catch (e: any) {
            console.error("Reject failed", e);
            setErrorModal({
                title: "拒绝失败",
                message: e instanceof Error ? e.message : "拒绝请求失败",
            });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <Card>
                <CardHeader>
                    <CardTitle>待审批的新增日程请求</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div>加载中...</div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                            }}
                        >
                            {items.length === 0 && (
                                <div>当前没有等待审批的日程请求。</div>
                            )}
                            {items.map((item) => {
                                // 安全解析 rawRequest（可能是 stringified JSON 或已对象）并提取常用字段
                                let parsed: any = null;
                                try {
                                    parsed =
                                        typeof item.rawRequest === "string"
                                            ? JSON.parse(item.rawRequest)
                                            : item.rawRequest;
                                } catch (e) {
                                    parsed = null;
                                }
                                const args = parsed?.args || parsed || {};
                                const name =
                                    args.name || args.title || "未命名请求";
                                const description =
                                    args.description || args.body || "";
                                // 期望 ISO 字符串（含时区/偏移），传给 ScheduleCard 以便按浏览器本地时区显示
                                const startTime =
                                    args.startTime || args.start || "";
                                const endTime = args.endTime || args.end || "";
                                const location =
                                    args.location || args.place || "";

                                // 提取邮件信息用于查看原始邮件
                                const emailData = parsed?.email;
                                const emailId = emailData?.id;
                                const emailMeta = emailId
                                    ? {
                                          subject:
                                              emailData.subject || "(无主题)",
                                          from: emailData.from,
                                          receivedAt: emailData.receivedAt,
                                      }
                                    : undefined;

                                return (
                                    <ScheduleCard
                                        key={item.id}
                                        name={name}
                                        description={description}
                                        startTime={startTime}
                                        endTime={endTime}
                                        location={location}
                                        onClick={() => setSelected(item)}
                                        rightActions={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 8,
                                                }}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Button
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setSelected(item)
                                                    }
                                                >
                                                    查看
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleApprove(item.id)
                                                    }
                                                    disabled={actionLoading}
                                                >
                                                    允许并添加
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        handleReject(item.id)
                                                    }
                                                    disabled={actionLoading}
                                                >
                                                    拒绝
                                                </Button>
                                                {emailId && emailMeta && (
                                                    <EmailViewer
                                                        emailId={emailId}
                                                        emailMeta={emailMeta}
                                                    />
                                                )}
                                            </div>
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <QueueTaskModal
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                item={selected}
                onAdded={() => load()}
            />

            <Modal
                isOpen={!!errorModal}
                onClose={() => setErrorModal(null)}
                title={errorModal?.title}
                footer={
                    <Button onClick={() => setErrorModal(null)}>
                        我知道了
                    </Button>
                }
            >
                <p style={{ color: "var(--color-text-medium)" }}>
                    {errorModal?.message}
                </p>
            </Modal>

            <Modal
                isOpen={!!conflictModal}
                onClose={() => setConflictModal(null)}
                title="日程冲突"
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
                            暂不添加
                        </Button>
                        <Button
                            onClick={handleApproveAllowConflict}
                            disabled={actionLoading}
                        >
                            仍然添加
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
                    与以下日程存在时间冲突，是否仍然添加？
                </p>
                <div
                    className="conflict-list"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                >
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
                                style={{ fontWeight: "bold", color: "#c53030" }}
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
        </div>
    );
};

export default ScheduleQueue;
