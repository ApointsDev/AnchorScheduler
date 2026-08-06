import React from "react";
import { format, parseISO } from "date-fns";
import { toShanghaiISO } from "../../utils/time";
import {
    createTask,
    rejectQueueItem,
    type ScheduleType,
} from "../../services/api";
import i18n from "../../i18n";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import BaseScheduleView from "./BaseScheduleView";
import type { BaseScheduleProps } from "./BaseScheduleView";
import "../../styles/Schedule.css";

interface QueueItem {
    id: string;
    userId: string;
    rawRequest: string | any;
    status: string;
    createdAt: string;
}

interface QueueTaskModalProps extends BaseScheduleProps {
    item: QueueItem | null;
    onAdded: () => void; // called when a task is added (so parent can refresh queue)
}

interface QueueTaskState {
    isEditing: boolean;
    edited: any;
    isSubmitting: boolean;
    error: string;
}

class QueueTaskModal extends BaseScheduleView<
    QueueTaskModalProps,
    QueueTaskState
> {
    constructor(props: QueueTaskModalProps) {
        super(props);
        this.state = {
            isEditing: true,
            edited: {},
            isSubmitting: false,
            error: "",
        };
    }

    componentDidUpdate(prevProps: QueueTaskModalProps) {
        if (this.props.item && this.props.item !== prevProps.item) {
            let parsed: any = null;
            try {
                parsed =
                    typeof this.props.item.rawRequest === "string"
                        ? JSON.parse(this.props.item.rawRequest)
                        : this.props.item.rawRequest;
            } catch {
                parsed = null;
            }
            const args = parsed?.args || parsed || {};

            this.setState({
                edited: {
                    name: args.name || args.title || "",
                    description: args.description || args.body || "",
                    location: args.location || args.place || "",
                    startTime: args.startTime || args.start || "",
                    endTime: args.endTime || args.end || "",
                    importance: args.importance || "normal",
                },
                isEditing: true,
                error: "",
            });
        }
    }

    private handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        this.setState((prev) => ({
            edited: { ...prev.edited, [name]: value },
        }));
    };

    private handleCreateAndRemove = async () => {
        const item = this.props.item;
        this.setState({ isSubmitting: true, error: "" });
        try {
            const edited = this.state.edited;
            const data: any = {
                name: edited.name || i18n.t("schedule.unnamedRequest"),
                description: edited.description || "",
                location: edited.location || "",
                startTime: edited.startTime
                    ? toShanghaiISO(edited.startTime)
                    : toShanghaiISO(),
                endTime: edited.endTime
                    ? toShanghaiISO(edited.endTime)
                    : toShanghaiISO(),
                dueDate: edited.endTime
                    ? toShanghaiISO(edited.endTime)
                    : toShanghaiISO(),
                pushedToMSTodo: false,
                importance: edited.importance || "normal",
                scheduleType: "single" as ScheduleType,
            };

            await createTask(data);
            // notify parent to refresh and remove queue item
            try {
                if (item) await rejectQueueItem(item.id);
            } catch (err) {
                console.warn("Failed to remove queue item after create:", err);
            }
            this.props.onAdded();
            this.props.onClose();
        } catch (err: any) {
            console.error("Failed to create task from queue item", err);
            this.setState({
                error:
                    err instanceof Error
                        ? err.message
                        : i18n.t("schedule.createFailed"),
            });
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    private t = (key: string, options?: Record<string, any>): string => {
        return i18n.t(key, options);
    };

    public render() {
        const { item, onClose } = this.props;
        if (!item) return null;

        const { isEditing, edited, isSubmitting, error } = this.state;
        const t = this.t;

        return this.renderModal(
            isEditing
                ? t("schedule.editQueuedTask")
                : t("schedule.queuedTaskDetail"),
            <>
                {error && <div className="error-banner">{error}</div>}

                <div className="add-task-form">
                    <Input
                        label={t("schedule.taskName")}
                        name="name"
                        value={edited.name || ""}
                        onChange={this.handleInputChange}
                        required
                    />
                    <Textarea
                        label={t("schedule.description")}
                        name="description"
                        value={edited.description || ""}
                        onChange={this.handleInputChange}
                    />
                    <div className="time-inputs">
                        <Input
                            label={t("schedule.startTime")}
                            name="startTime"
                            type="datetime-local"
                            value={
                                edited.startTime
                                    ? format(
                                          parseISO(edited.startTime),
                                          "yyyy-MM-dd'T'HH:mm",
                                      )
                                    : ""
                            }
                            onChange={(e) =>
                                this.setState((prev: any) => ({
                                    edited: {
                                        ...prev.edited,
                                        startTime: e.target.value
                                            ? toShanghaiISO(
                                                  new Date(e.target.value),
                                              )
                                            : "",
                                    },
                                }))
                            }
                        />
                        <Input
                            label={t("schedule.endTime")}
                            name="endTime"
                            type="datetime-local"
                            value={
                                edited.endTime
                                    ? format(
                                          parseISO(edited.endTime),
                                          "yyyy-MM-dd'T'HH:mm",
                                      )
                                    : ""
                            }
                            onChange={(e) =>
                                this.setState((prev: any) => ({
                                    edited: {
                                        ...prev.edited,
                                        endTime: e.target.value
                                            ? toShanghaiISO(
                                                  new Date(e.target.value),
                                              )
                                            : "",
                                    },
                                }))
                            }
                        />
                    </div>
                    <Input
                        label={t("schedule.location")}
                        name="location"
                        value={edited.location || ""}
                        onChange={this.handleInputChange}
                    />
                </div>
            </>,
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div />
                <div style={{ display: "flex", gap: 8 }}>
                    <Button variant="secondary" onClick={onClose}>
                        {t("common.close")}
                    </Button>
                    <Button
                        onClick={this.handleCreateAndRemove}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? t("common.adding")
                            : t("schedule.saveAndAdd")}
                    </Button>
                </div>
            </div>,
        );
    }
}

export default QueueTaskModal;
