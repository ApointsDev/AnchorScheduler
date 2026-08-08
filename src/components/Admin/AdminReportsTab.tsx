/**
 * AdminReportsTab - 管理员反馈 / 举报管理面板（RPT-001）
 * 功能：查看用户提交的反馈与举报、按类型/状态筛选、标记处理状态、删除
 */
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    getAdminReports,
    updateAdminReportStatus,
    deleteAdminReport,
    type AdminReportRow,
    type ReportType,
    type ReportStatus,
} from "../../services/adminApi";
import LoadingSpinner from "../ui/LoadingSpinner";

const PAGE_SIZE = 20;

const STATUS_OPTIONS: ReportStatus[] = [
    "pending",
    "processing",
    "resolved",
    "rejected",
];

const STATUS_CLASS: Record<ReportStatus, string> = {
    pending: "report-status-pending",
    processing: "report-status-processing",
    resolved: "report-status-resolved",
    rejected: "report-status-rejected",
};

function formatDate(iso: string | null | undefined): string {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function errMsg(e: unknown, fallback: string): string {
    return e instanceof Error ? e.message : fallback;
}

export default function AdminReportsTab() {
    const { t } = useTranslation();

    const [reports, setReports] = useState<AdminReportRow[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<ReportType | "">("");
    const [statusFilter, setStatusFilter] = useState<ReportStatus | "">("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    const load = useCallback(
        async (pageNum?: number) => {
            setLoading(true);
            setError("");
            try {
                const data = await getAdminReports({
                    page: pageNum || page,
                    limit: PAGE_SIZE,
                    type: typeFilter || undefined,
                    status: statusFilter || undefined,
                    search: search || undefined,
                });
                setReports(data.reports);
                setTotal(data.total);
                setPage(data.page);
            } catch (e) {
                setError(errMsg(e, t("admin.loadFailed")));
            } finally {
                setLoading(false);
            }
        },
        [page, typeFilter, statusFilter, search, t],
    );

    useEffect(() => {
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeFilter, statusFilter]);

    const handleSearch = () => {
        setSearch(searchInput.trim());
        load(1);
    };

    const handleStatusChange = async (
        id: string,
        status: ReportStatus,
    ) => {
        setError("");
        setSuccess("");
        try {
            await updateAdminReportStatus(id, status);
            setSuccess(t("admin.saveSuccess"));
            load();
        } catch (e) {
            setError(errMsg(e, t("admin.saveFailed")));
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t("admin.confirmDeleteReport"))) return;
        setDeletingId(id);
        setError("");
        setSuccess("");
        try {
            await deleteAdminReport(id);
            setSuccess(t("admin.deleteSuccess"));
            load();
        } catch (e) {
            setError(errMsg(e, t("admin.deleteFailed")));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="admin-reports-tab">
            <div className="admin-toolbar">
                <select
                    className="admin-search"
                    value={typeFilter}
                    onChange={(e) =>
                        setTypeFilter(e.target.value as ReportType | "")
                    }
                >
                    <option value="">{t("admin.reportAllTypes")}</option>
                    <option value="feedback">{t("admin.reportFeedback")}</option>
                    <option value="report">{t("admin.reportReport")}</option>
                </select>
                <select
                    className="admin-search"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as ReportStatus | "")
                    }
                >
                    <option value="">{t("admin.reportAllStatus")}</option>
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {t(`admin.reportStatus.${s}`)}
                        </option>
                    ))}
                </select>
                <input
                    className="admin-search"
                    type="text"
                    placeholder={t("admin.reportSearchPlaceholder")}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={handleSearch}
                >
                    {t("common.search")}
                </button>
                <button
                    className="admin-btn"
                    onClick={() => {
                        setSearchInput("");
                        setSearch("");
                        setTypeFilter("");
                        setStatusFilter("");
                        load(1);
                    }}
                >
                    {t("common.refresh")}
                </button>
            </div>

            {error && <div className="admin-error">{error}</div>}
            {success && <div className="admin-success">{success}</div>}

            {loading ? (
                <LoadingSpinner />
            ) : reports.length === 0 ? (
                <div className="admin-empty">{t("admin.noReports")}</div>
            ) : (
                <>
                    <div className="admin-table-wrapper admin-reports-table-wrapper">
                        <table className="admin-table admin-reports-table">
                            <thead>
                                <tr>
                                    <th>{t("admin.reportUser")}</th>
                                    <th>{t("admin.reportType")}</th>
                                    <th>{t("admin.reportCategory")}</th>
                                    <th>{t("admin.reportContent")}</th>
                                    <th>{t("admin.reportContact")}</th>
                                    <th>{t("admin.reportStatusLabel")}</th>
                                    <th>{t("admin.reportTime")}</th>
                                    <th>{t("admin.actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((r) => (
                                    <tr key={r.id}>
                                        <td>
                                            <div className="report-user">
                                                {r.userName || "-"}
                                            </div>
                                            <div className="report-user-email">
                                                {r.userEmail || "-"}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`report-type-badge report-type-${r.type}`}
                                            >
                                                {r.type === "report"
                                                    ? t("admin.reportReport")
                                                    : t("admin.reportFeedback")}
                                            </span>
                                        </td>
                                        <td>{r.category || "-"}</td>
                                        <td>
                                            <div
                                                className="report-content"
                                                onClick={() =>
                                                    setExpandedId(
                                                        expandedId === r.id
                                                            ? null
                                                            : r.id,
                                                    )
                                                }
                                                title={
                                                    expandedId === r.id
                                                        ? r.content
                                                        : undefined
                                                }
                                            >
                                                {expandedId === r.id
                                                    ? r.content
                                                    : r.content.slice(0, 60) +
                                                      (r.content.length > 60
                                                          ? "..."
                                                          : "")}
                                            </div>
                                            {r.targetId && (
                                                <div className="report-target">
                                                    {t("admin.reportTarget")}:{" "}
                                                    {r.targetId}
                                                </div>
                                            )}
                                        </td>
                                        <td>{r.contact || "-"}</td>
                                        <td>
                                            <select
                                                className={`report-status-select ${STATUS_CLASS[r.status]}`}
                                                value={r.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        r.id,
                                                        e.target
                                                            .value as ReportStatus,
                                                    )
                                                }
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>
                                                        {t(
                                                            `admin.reportStatus.${s}`,
                                                        )}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>{formatDate(r.createdAt)}</td>
                                        <td>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-danger-outline"
                                                disabled={deletingId === r.id}
                                                onClick={() =>
                                                    handleDelete(r.id)
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
                            onClick={() => load(page - 1)}
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
                            onClick={() => load(page + 1)}
                            disabled={page >= totalPages}
                        >
                            {t("admin.nextPage")}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
