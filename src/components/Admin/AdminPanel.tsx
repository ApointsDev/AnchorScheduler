/**
 * AdminPanel - 管理员用户管理面板
 * 功能：用户列表、搜索、分页、字段编辑、添加用户、删除用户、查看日程
 */

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    getAdminFields,
    getAdminUsers,
    updateAdminUser,
    createAdminUser,
    deleteAdminUser,
    getAdminUserSchedule,
    type AdminFieldMeta,
    type AdminUserRow,
    type AdminUserSchedule,
} from "../../services/adminApi";
import logo from "../../assets/logo.svg";
import LoadingSpinner from "../ui/LoadingSpinner";
import "../../styles/Admin.css";

// ── 任务重要性标签 ──────────────────────────────────────────────

const IMPORTANCE_LABELS: Record<string, string> = {
    high: "admin.high",
    normal: "admin.normal",
    low: "admin.low",
};

// ── 常量 ────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

// 表格显示的列顺序
const TABLE_COLUMNS = [
    "email",
    "name",
    "taskCount",
    "MSbinded",
    "ExchangeBinded",
    "ebridgeBinded",
    "SmtpBinded",
    "CalDavEnabled",
    "CalDavServerEnabled",
    "timetableFetchLevel",
    "mailReadingSpan",
    "weekOffset",
    "conflictBoundaryInclusive",
    "createdAt",
    "updatedAt",
];

// 编辑时不显示在列表中的字段（只读或太长的 token）
const SKIP_EDIT_FIELDS = new Set(["id", "createdAt", "updatedAt", "taskCount"]);

// ── 工具函数 ────────────────────────────────────────────────────

function maskSensitive(value: string | null): string {
    if (!value) return "-";
    if (value.length <= 8) return "***";
    return value.slice(0, 4) + "..." + value.slice(-4);
}

function formatCell(
    row: AdminUserRow,
    key: string,
    fieldMeta?: AdminFieldMeta,
): string {
    const val = (row as any)[key];
    const isSensitive = fieldMeta?.sensitive;

    if (isSensitive && val) return maskSensitive(val);
    if (val === null || val === undefined) return "-";
    if (typeof val === "boolean") return val ? "✓" : "✗";
    if (typeof val === "object") return JSON.stringify(val).slice(0, 30);
    return String(val).slice(0, 80);
}

function getCellClassName(
    _key: string,
    val: any,
    fieldMeta?: AdminFieldMeta,
): string {
    const classes: string[] = [];
    if (fieldMeta?.sensitive && val) classes.push("sensitive-cell");
    if (typeof val === "boolean")
        classes.push("bool-cell", val ? "bool-true" : "bool-false");
    return classes.join(" ");
}

function formatTime(dateStr?: string): string {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// ── 编辑面板子组件 ─────────────────────────────────────────────

function EditPanel({
    user,
    fieldMeta,
    onClose,
    onSaved,
}: {
    user: AdminUserRow;
    fieldMeta: Record<string, AdminFieldMeta>;
    onClose: () => void;
    onSaved: () => void;
}) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState<Record<string, any>>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const hasChanges = Object.keys(editing).length > 0;

    const handleFieldChange = (key: string, value: any) => {
        setEditing((prev) => ({ ...prev, [key]: value }));
        setError("");
        setSuccess("");
    };

    const handleSave = async () => {
        if (!hasChanges) return;
        setSaving(true);
        setError("");
        try {
            await updateAdminUser(user.id, editing);
            setSuccess(t("admin.saveSuccess"));
            setEditing({});
            onSaved();
        } catch (err: any) {
            setError(err.message || t("admin.saveFailed"));
        } finally {
            setSaving(false);
        }
    };

    const renderField = (key: string) => {
        const meta = fieldMeta[key];
        if (!meta) return null;
        if (SKIP_EDIT_FIELDS.has(key)) return null;

        const currentVal = editing.hasOwnProperty(key)
            ? editing[key]
            : (user as any)[key];
        const isDirty = editing.hasOwnProperty(key);

        return (
            <div
                key={key}
                className="admin-field-group"
                style={
                    isDirty
                        ? { background: "var(--color-warning-50)" }
                        : undefined
                }
            >
                <div className="admin-field-label">
                    {key}
                    {meta.sensitive && (
                        <span className="sensitive-badge">
                            {t("admin.sensitive")}
                        </span>
                    )}
                    {isDirty && (
                        <span
                            style={{
                                marginLeft: 4,
                                color: "var(--color-warning-600)",
                                fontSize: 10,
                            }}
                        >
                            {t("admin.modified")}
                        </span>
                    )}
                </div>
                <div className="admin-field-input">
                    {meta.type === "boolean" ? (
                        <div className="admin-toggle">
                            <button
                                className={`admin-toggle-switch ${currentVal ? "active" : ""}`}
                                onClick={() =>
                                    handleFieldChange(key, !currentVal)
                                }
                                type="button"
                            />
                            <span style={{ fontSize: 13 }}>
                                {currentVal ? t("common.yes") : t("common.no")}
                            </span>
                        </div>
                    ) : meta.type === "json" ? (
                        <textarea
                            value={
                                typeof currentVal === "string"
                                    ? currentVal
                                    : JSON.stringify(currentVal || {}, null, 2)
                            }
                            onChange={(e) =>
                                handleFieldChange(key, e.target.value)
                            }
                            rows={4}
                        />
                    ) : meta.type === "number" ? (
                        <input
                            type="number"
                            value={currentVal ?? ""}
                            onChange={(e) =>
                                handleFieldChange(
                                    key,
                                    e.target.value === ""
                                        ? null
                                        : Number(e.target.value),
                                )
                            }
                        />
                    ) : (
                        <input
                            type="text"
                            value={currentVal || ""}
                            onChange={(e) =>
                                handleFieldChange(key, e.target.value || null)
                            }
                        />
                    )}
                </div>
            </div>
        );
    };

    const allFieldKeys = Object.keys(fieldMeta).filter(
        (k) => !SKIP_EDIT_FIELDS.has(k),
    );

    return (
        <div
            className="admin-edit-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="admin-edit-panel">
                <div className="admin-edit-header">
                    <div>
                        <h2>{user.name}</h2>
                        <div className="admin-user-email">
                            {user.email} · {user.id}
                        </div>
                    </div>
                    <button className="admin-edit-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="admin-edit-body">
                    {error && <div className="admin-error">{error}</div>}
                    {success && <div className="admin-success">{success}</div>}
                    {allFieldKeys.map(renderField)}
                </div>
                <div className="admin-edit-footer">
                    <button
                        className="admin-btn"
                        onClick={onClose}
                        disabled={saving}
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        className="admin-btn admin-btn-primary"
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                    >
                        {saving
                            ? t("common.saving")
                            : t("admin.saveCount", {
                                  count: Object.keys(editing).length,
                              })}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── 创建用户模态框子组件 ─────────────────────────────────────

function CreateUserModal({
    onClose,
    onCreated,
}: {
    onClose: () => void;
    onCreated: () => void;
}) {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [xjtlAccount, setXjtlAccount] = useState("");
    const [xjtlPassword, setXjtlPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !name.trim()) {
            setError(t("admin.emailRequired"));
            return;
        }
        setSaving(true);
        setError("");
        try {
            await createAdminUser({
                email: email.trim(),
                name: name.trim(),
                password: password || undefined,
                XJTLUaccount: xjtlAccount || undefined,
                XJTLUPassword: xjtlPassword || undefined,
            });
            onCreated();
        } catch (err: any) {
            setError(err.message || t("admin.createFailed"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="admin-modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="admin-modal admin-create-modal">
                <div className="admin-modal-header">
                    <h2>{t("admin.addUser")}</h2>
                    <button className="admin-modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="admin-modal-body">
                    {error && <div className="admin-error">{error}</div>}
                    <div className="admin-create-field">
                        <label>
                            {t("auth.email")}{" "}
                            <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div className="admin-create-field">
                        <label>
                            {t("admin.nickname")}{" "}
                            <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("admin.nickname")}
                            required
                        />
                    </div>
                    <div className="admin-create-field">
                        <label>
                            {t("auth.password")}{" "}
                            <span className="optional">
                                {t("common.optional")}
                            </span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t("admin.noPasswordHint")}
                        />
                    </div>
                    <div className="admin-create-field">
                        <label>
                            {t("admin.XJTLUAccount")}{" "}
                            <span className="optional">
                                {t("common.optional")}
                            </span>
                        </label>
                        <input
                            type="text"
                            value={xjtlAccount}
                            onChange={(e) => setXjtlAccount(e.target.value)}
                            placeholder="例如 san.zhang23"
                        />
                    </div>
                    <div className="admin-create-field">
                        <label>
                            {t("admin.XJTLUPassword")}{" "}
                            <span className="optional">
                                {t("common.optional")}
                            </span>
                        </label>
                        <input
                            type="password"
                            value={xjtlPassword}
                            onChange={(e) => setXjtlPassword(e.target.value)}
                            placeholder={t("admin.noPasswordSet")}
                        />
                    </div>
                    <div className="admin-modal-footer">
                        <button
                            type="button"
                            className="admin-btn"
                            onClick={onClose}
                            disabled={saving}
                        >
                            {t("common.cancel")}
                        </button>
                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={saving}
                        >
                            {saving
                                ? t("admin.creating")
                                : t("admin.createUser")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── 日程查看面板子组件 ──────────────────────────────────────

function SchedulePanel({
    userId,
    userName,
    userEmail,
    onClose,
}: {
    userId: string;
    userName: string;
    userEmail: string;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const [schedule, setSchedule] = useState<AdminUserSchedule | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");
        getAdminUserSchedule(userId)
            .then((data) => {
                if (!cancelled) setSchedule(data);
            })
            .catch((err: any) => {
                if (!cancelled)
                    setError(err.message || t("schedule.loadFailed"));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [userId]);

    return (
        <div
            className="admin-modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="admin-modal admin-schedule-modal">
                <div className="admin-modal-header">
                    <div>
                        <h2>{t("admin.scheduleOf", { name: userName })}</h2>
                        <div className="admin-user-email">{userEmail}</div>
                    </div>
                    <button className="admin-modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="admin-modal-body admin-schedule-body">
                    {loading && <LoadingSpinner text={t("schedule.loading")} />}
                    {error && <div className="admin-error">{error}</div>}
                    {schedule && !loading && (
                        <>
                            <div className="admin-schedule-summary">
                                {t("schedule.totalTasks", {
                                    count: schedule.total,
                                })}
                            </div>
                            {schedule.tasks.length === 0 ? (
                                <div className="admin-empty">
                                    {t("schedule.noSchedule")}
                                </div>
                            ) : (
                                <div className="admin-schedule-grid">
                                    {schedule.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`admin-task-card ${task.completed ? "task-completed" : ""}`}
                                        >
                                            <div className="admin-task-header">
                                                <span className="admin-task-name">
                                                    {task.name}
                                                </span>
                                                <div className="admin-task-badges">
                                                    {task.importance &&
                                                        IMPORTANCE_LABELS[
                                                            task.importance
                                                        ] && (
                                                            <span
                                                                className={`admin-badge admin-badge-${task.importance}`}
                                                            >
                                                                {t(
                                                                    IMPORTANCE_LABELS[
                                                                        task
                                                                            .importance
                                                                    ],
                                                                )}
                                                            </span>
                                                        )}
                                                    <span
                                                        className={`admin-badge ${task.completed ? "admin-badge-done" : "admin-badge-pending"}`}
                                                    >
                                                        {task.completed
                                                            ? t(
                                                                  "admin.completed",
                                                              )
                                                            : t(
                                                                  "admin.pending",
                                                              )}
                                                    </span>
                                                </div>
                                            </div>
                                            {task.description && (
                                                <div className="admin-task-desc">
                                                    {task.description}
                                                </div>
                                            )}
                                            <div className="admin-task-meta">
                                                {task.startTime && (
                                                    <span
                                                        title={`${t("admin.startLabel")}: ${new Date(task.startTime).toLocaleString("zh-CN")}`}
                                                    >
                                                        {t("admin.startLabel")}{" "}
                                                        {formatTime(
                                                            task.startTime,
                                                        )}
                                                    </span>
                                                )}
                                                {task.endTime && (
                                                    <span
                                                        title={`${t("admin.endLabel")}: ${new Date(task.endTime).toLocaleString("zh-CN")}`}
                                                    >
                                                        {t("admin.endLabel")}{" "}
                                                        {formatTime(
                                                            task.endTime,
                                                        )}
                                                    </span>
                                                )}
                                                {task.dueDate && (
                                                    <span
                                                        title={`${t("admin.dueLabel")}: ${new Date(task.dueDate).toLocaleString("zh-CN")}`}
                                                    >
                                                        {t("admin.dueLabel")}{" "}
                                                        {formatTime(
                                                            task.dueDate,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="admin-task-footer">
                                                {task.location && (
                                                    <span className="admin-task-location">
                                                        {task.location}
                                                    </span>
                                                )}
                                                {task.scheduleType && (
                                                    <span className="admin-task-type">
                                                        {task.scheduleType}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn" onClick={onClose}>
                        {t("common.close")}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── 删除确认框子组件 ─────────────────────────────────────────

function DeleteConfirmModal({
    userName,
    userEmail,
    onClose,
    onConfirm,
}: {
    userName: string;
    userEmail: string;
    onClose: () => void;
    onConfirm: () => void;
}) {
    const { t } = useTranslation();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setDeleting(true);
        setError("");
        try {
            await onConfirm();
        } catch (err: any) {
            setError(err.message || t("admin.deleteFailed"));
            setDeleting(false);
        }
    };

    return (
        <div
            className="admin-modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="admin-modal admin-confirm-modal">
                <div className="admin-modal-header">
                    <h2>{t("admin.deleteTitle")}</h2>
                    <button className="admin-modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="admin-modal-body">
                    {error && <div className="admin-error">{error}</div>}
                    <p style={{ margin: "0 0 8px 0" }}>
                        {t("admin.confirmDeleteUser")}
                    </p>
                    <div
                        style={{
                            background: "var(--color-neutral-50)",
                            padding: "12px",
                            borderRadius: "6px",
                            fontSize: "13px",
                        }}
                    >
                        <div>
                            <b>{t("admin.nickname")}：</b>
                            {userName}
                        </div>
                        <div>
                            <b>{t("auth.email")}：</b>
                            {userEmail}
                        </div>
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <button
                        className="admin-btn"
                        onClick={onClose}
                        disabled={deleting}
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        className="admin-btn admin-btn-danger"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting
                            ? t("admin.deleting")
                            : t("common.confirmDelete")}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── 主面板 ──────────────────────────────────────────────────────

export default function AdminPanel() {
    const { t } = useTranslation();
    const [fieldMeta, setFieldMeta] = useState<Record<string, AdminFieldMeta>>(
        {},
    );
    const [users, setUsers] = useState<AdminUserRow[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null);

    // 模态框状态
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [scheduleUser, setScheduleUser] = useState<AdminUserRow | null>(null);
    const [deleteUser, setDeleteUser] = useState<AdminUserRow | null>(null);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    const loadData = useCallback(
        async (searchTerm?: string, pageNum?: number) => {
            setLoading(true);
            setError("");
            try {
                const data = await getAdminUsers({
                    search: searchTerm || undefined,
                    page: pageNum || 1,
                    limit: PAGE_SIZE,
                });
                setUsers(data.users);
                setTotal(data.total);
                setPage(data.page);
            } catch (err: any) {
                setError(err.message || t("admin.loadFailed"));
                if (
                    err.message?.includes("需要管理员权限") ||
                    err.message?.includes("403")
                ) {
                    setError(t("admin.noPermission"));
                }
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    useEffect(() => {
        getAdminFields()
            .then(setFieldMeta)
            .catch(() => {});
        loadData();
    }, [loadData]);

    const handleSearch = () => {
        setSearch(searchInput);
        loadData(searchInput, 1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleRefresh = () => {
        setSearchInput(search);
        loadData(search, page);
    };

    const handlePrevPage = () => {
        if (page > 1) loadData(search, page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) loadData(search, page + 1);
    };

    const handleUserSaved = () => {
        loadData(search, page);
        if (selectedUser) {
            setSelectedUser(null);
        }
    };

    const handleUserCreated = () => {
        setShowCreateModal(false);
        loadData(search, page);
    };

    const handleDeleteUser = async (userId: string) => {
        await deleteAdminUser(userId);
        setDeleteUser(null);
        loadData(search, page);
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>
                    <img
                        src={logo}
                        alt={t("app.title")}
                        style={{
                            height: "28px",
                            marginRight: "8px",
                            verticalAlign: "middle",
                        }}
                    />
                    {t("admin.userManagement")}
                </h1>
                <div className="admin-toolbar">
                    <input
                        className="admin-search"
                        type="text"
                        placeholder={t("admin.searchUser")}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="admin-btn admin-btn-primary"
                        onClick={handleSearch}
                    >
                        {t("common.search")}
                    </button>
                    <button className="admin-btn" onClick={handleRefresh}>
                        {t("common.refresh")}
                    </button>
                    <button
                        className="admin-btn admin-btn-success"
                        onClick={() => setShowCreateModal(true)}
                    >
                        ＋ {t("admin.addUser")}
                    </button>
                </div>
            </div>

            {error && <div className="admin-error">{error}</div>}

            {loading ? (
                <LoadingSpinner />
            ) : users.length === 0 ? (
                <div className="admin-empty">{t("admin.noUser")}</div>
            ) : (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    {TABLE_COLUMNS.map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                    <th>{t("admin.actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((row) => (
                                    <tr key={row.id}>
                                        {TABLE_COLUMNS.map((key) => {
                                            const meta = fieldMeta[key];
                                            return (
                                                <td
                                                    key={key}
                                                    className={getCellClassName(
                                                        key,
                                                        (row as any)[key],
                                                        meta,
                                                    )}
                                                    onClick={() =>
                                                        setSelectedUser(row)
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {formatCell(row, key, meta)}
                                                </td>
                                            );
                                        })}
                                        <td
                                            className="admin-actions-cell"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className="admin-btn admin-btn-sm"
                                                onClick={() =>
                                                    setScheduleUser(row)
                                                }
                                            >
                                                {t("admin.scheduleTab")}
                                            </button>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-danger-outline"
                                                onClick={() =>
                                                    setDeleteUser(row)
                                                }
                                            >
                                                {t("common.delete")}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="admin-pagination">
                        <button
                            className="admin-btn"
                            onClick={handlePrevPage}
                            disabled={page <= 1}
                        >
                            {t("admin.prevPage")}
                        </button>
                        <span>
                            {t("admin.pagination", {
                                page,
                                totalPages: totalPages || 1,
                                total,
                            })}
                        </span>
                        <button
                            className="admin-btn"
                            onClick={handleNextPage}
                            disabled={page >= totalPages}
                        >
                            {t("admin.nextPage")}
                        </button>
                    </div>
                </>
            )}

            {selectedUser && (
                <EditPanel
                    user={selectedUser}
                    fieldMeta={fieldMeta}
                    onClose={() => setSelectedUser(null)}
                    onSaved={handleUserSaved}
                />
            )}

            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={handleUserCreated}
                />
            )}

            {scheduleUser && (
                <SchedulePanel
                    userId={scheduleUser.id}
                    userName={scheduleUser.name}
                    userEmail={scheduleUser.email}
                    onClose={() => setScheduleUser(null)}
                />
            )}

            {deleteUser && (
                <DeleteConfirmModal
                    userName={deleteUser.name}
                    userEmail={deleteUser.email}
                    onClose={() => setDeleteUser(null)}
                    onConfirm={() => handleDeleteUser(deleteUser.id)}
                />
            )}
        </div>
    );
}
