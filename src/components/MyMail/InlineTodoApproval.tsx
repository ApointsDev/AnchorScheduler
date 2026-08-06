import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    approveTodoQueueItem,
    rejectTodoQueueItem,
    type TodoQueueItem,
} from "../../services/api";
import { Button } from "../ui/Button";
import { Check, X, Clock, Loader2, ListTodo } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Props {
    items: TodoQueueItem[];
    onItemsChange: () => void;
}

const InlineTodoApproval: React.FC<Props> = ({ items, onItemsChange }) => {
    const { t } = useTranslation();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
    const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const formatTime = (iso: string) => {
        try {
            return format(parseISO(iso), "MM/dd HH:mm");
        } catch {
            return iso;
        }
    };

    const handleApprove = async (queueId: string) => {
        setLoadingId(queueId);
        setErrorMsg(null);
        try {
            await approveTodoQueueItem(queueId);
            setApprovedIds((prev) => new Set(prev).add(queueId));
            onItemsChange();
        } catch (e: any) {
            setErrorMsg(
                e instanceof Error
                    ? e.message
                    : t("schedule.approveFailed", { defaultValue: "批准失败" }),
            );
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (queueId: string) => {
        setLoadingId(queueId);
        setErrorMsg(null);
        try {
            await rejectTodoQueueItem(queueId);
            setRejectedIds((prev) => new Set(prev).add(queueId));
            onItemsChange();
        } catch (e: any) {
            setErrorMsg(
                e instanceof Error
                    ? e.message
                    : t("schedule.rejectFailed", { defaultValue: "拒绝失败" }),
            );
        } finally {
            setLoadingId(null);
        }
    };

    const visibleItems = items.filter(
        (item) => !rejectedIds.has(item.id) && !approvedIds.has(item.id),
    );
    const allResolved = items.length > 0 && visibleItems.length === 0;

    if (allResolved) {
        return (
            <div className="inline-approval-done">
                <Check size={14} />{" "}
                {t("schedule.allProcessed", { defaultValue: "全部已处理" })}
            </div>
        );
    }

    return (
        <div className="inline-schedule-approval">
            <div className="inline-approval-header">
                <span>
                    <ListTodo size={14} style={{ marginRight: 4 }} />
                    {t("schedule.aiRecognizedTodos", {
                        count: items.length,
                        defaultValue: `AI 识别到 ${items.length} 个待办`,
                    })}
                </span>
            </div>

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
                    args.name ||
                    args.title ||
                    t("schedule.unnamedTodo", { defaultValue: "未命名待办" });
                const dueDate =
                    args.dueDate || args.endTime || args.end || "";

                const isProcessing = loadingId === item.id;

                return (
                    <div key={item.id} className="inline-approval-card">
                        <div className="inline-approval-card-body">
                            <div className="inline-approval-card-name">
                                {name}
                            </div>
                            <div className="inline-approval-card-time">
                                <Clock size={12} />
                                {dueDate
                                    ? `${t("schedule.dueDate", { defaultValue: "截止" })}: ${formatTime(dueDate)}`
                                    : t("schedule.noDueDate", {
                                          defaultValue: "无截止日期",
                                      })}
                            </div>
                        </div>
                        <div className="inline-approval-card-actions">
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
                                {t("schedule.approve", {
                                    defaultValue: "批准",
                                })}
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleReject(item.id)}
                                disabled={!!loadingId}
                            >
                                <X size={14} />
                                {t("schedule.reject", {
                                    defaultValue: "拒绝",
                                })}
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default InlineTodoApproval;
