/**
 * AdminAppUpdateTab - 管理员应用版本更新配置面板（UPD-001）
 * 功能：配置各平台最新版本号与外部下载源、更新说明、强制更新、启停、删除
 */
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    getAdminAppReleases,
    saveAdminAppRelease,
    setAdminAppReleaseEnabled,
    deleteAdminAppRelease,
    type AdminAppRelease,
    type AdminAppReleaseInput,
    type AppPlatform,
} from "../../services/adminApi";
import LoadingSpinner from "../ui/LoadingSpinner";

const PLATFORM_OPTIONS: AppPlatform[] = ["android", "ios", "web", "all"];

const EMPTY_FORM: AdminAppReleaseInput = {
    platform: "android",
    version: "",
    versionCode: 0,
    downloadUrl: "",
    releaseNotes: "",
    forceUpdate: false,
    enabled: true,
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

export default function AdminAppUpdateTab() {
    const { t } = useTranslation();

    const [releases, setReleases] = useState<AdminAppRelease[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // 编辑表单状态
    const [form, setForm] = useState<AdminAppReleaseInput>(EMPTY_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getAdminAppReleases();
            setReleases(data.releases);
        } catch (e) {
            setError(errMsg(e, t("admin.loadFailed")));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        load();
    }, [load]);

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
        setShowForm(true);
    };

    const openEdit = (r: AdminAppRelease) => {
        setEditingId(r.id);
        setForm({
            id: r.id,
            platform: r.platform,
            version: r.version,
            versionCode: r.versionCode,
            downloadUrl: r.downloadUrl,
            releaseNotes: r.releaseNotes || "",
            forceUpdate: r.forceUpdate,
            enabled: r.enabled,
        });
        setShowForm(true);
    };

    const handleSave = async () => {
        setError("");
        setSuccess("");
        if (!form.version.trim() || !form.downloadUrl.trim()) {
            setError(t("admin.appUpdateRequired"));
            return;
        }
        setSaving(true);
        try {
            await saveAdminAppRelease({
                ...form,
                versionCode:
                    form.versionCode != null
                        ? Number(form.versionCode) || 0
                        : 0,
            });
            setSuccess(t("admin.saveSuccess"));
            setShowForm(false);
            load();
        } catch (e) {
            setError(errMsg(e, t("admin.saveFailed")));
        } finally {
            setSaving(false);
        }
    };

    const handleToggleEnabled = async (r: AdminAppRelease) => {
        setError("");
        setSuccess("");
        try {
            await setAdminAppReleaseEnabled(r.id, !r.enabled);
            load();
        } catch (e) {
            setError(errMsg(e, t("admin.saveFailed")));
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t("admin.confirmDeleteRelease"))) return;
        setDeletingId(id);
        setError("");
        setSuccess("");
        try {
            await deleteAdminAppRelease(id);
            setSuccess(t("admin.deleteSuccess"));
            load();
        } catch (e) {
            setError(errMsg(e, t("admin.deleteFailed")));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="admin-appupdate-tab">
            <div className="admin-toolbar">
                <button
                    className="admin-btn admin-btn-success"
                    onClick={openCreate}
                >
                    ＋ {t("admin.addRelease")}
                </button>
            </div>

            {error && <div className="admin-error">{error}</div>}
            {success && <div className="admin-success">{success}</div>}

            {loading ? (
                <LoadingSpinner />
            ) : releases.length === 0 ? (
                <div className="admin-empty">{t("admin.noReleases")}</div>
            ) : (
                <div className="admin-table-wrapper admin-appupdate-table-wrapper">
                    <table className="admin-table admin-appupdate-table">
                        <thead>
                            <tr>
                                <th>{t("admin.releasePlatform")}</th>
                                <th>{t("admin.releaseVersion")}</th>
                                <th>{t("admin.releaseVersionCode")}</th>
                                <th>{t("admin.releaseDownloadUrl")}</th>
                                <th>{t("admin.releaseNotes")}</th>
                                <th>{t("admin.releaseForceUpdate")}</th>
                                <th>{t("admin.releaseEnabled")}</th>
                                <th>{t("admin.releaseUpdatedAt")}</th>
                                <th>{t("admin.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {releases.map((r) => (
                                <tr key={r.id}>
                                    <td>
                                        <span
                                            className={`release-platform-badge release-platform-${r.platform}`}
                                        >
                                            {r.platform}
                                        </span>
                                    </td>
                                    <td className="release-version">
                                        {r.version}
                                    </td>
                                    <td>{r.versionCode || "-"}</td>
                                    <td>
                                        <a
                                            href={r.downloadUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="release-download-link"
                                            title={r.downloadUrl}
                                        >
                                            {r.downloadUrl.slice(0, 40)}
                                            {r.downloadUrl.length > 40
                                                ? "..."
                                                : ""}
                                        </a>
                                    </td>
                                    <td>
                                        <div
                                            className="release-notes"
                                            title={r.releaseNotes || ""}
                                        >
                                            {r.releaseNotes
                                                ? r.releaseNotes.slice(0, 40) +
                                                  (r.releaseNotes.length > 40
                                                      ? "..."
                                                      : "")
                                                : "-"}
                                        </div>
                                    </td>
                                    <td>
                                        {r.forceUpdate
                                            ? t("common.yes")
                                            : t("common.no")}
                                    </td>
                                    <td>
                                        <button
                                            className={`admin-toggle-switch ${r.enabled ? "active" : ""}`}
                                            onClick={() =>
                                                handleToggleEnabled(r)
                                            }
                                            type="button"
                                            title={
                                                r.enabled
                                                    ? t("common.enabled")
                                                    : t("common.disabled")
                                            }
                                        />
                                    </td>
                                    <td>{formatDate(r.updatedAt)}</td>
                                    <td>
                                        <button
                                            className="admin-btn admin-btn-sm"
                                            onClick={() => openEdit(r)}
                                        >
                                            {t("common.edit")}
                                        </button>
                                        <button
                                            className="admin-btn admin-btn-sm admin-btn-danger-outline"
                                            disabled={deletingId === r.id}
                                            onClick={() => handleDelete(r.id)}
                                        >
                                            {t("common.delete")}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <div
                    className="admin-modal-overlay"
                    onClick={(e) =>
                        e.target === e.currentTarget && setShowForm(false)
                    }
                >
                    <div className="admin-modal admin-appupdate-form">
                        <div className="admin-modal-header">
                            <h2>
                                {editingId
                                    ? t("admin.editRelease")
                                    : t("admin.addRelease")}
                            </h2>
                            <button
                                className="admin-modal-close"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-create-field">
                                <label>{t("admin.releasePlatform")} *</label>
                                <select
                                    value={form.platform}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            platform: e.target
                                                .value as AppPlatform,
                                        })
                                    }
                                >
                                    {PLATFORM_OPTIONS.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="admin-create-field">
                                <label>{t("admin.releaseVersion")} *</label>
                                <input
                                    type="text"
                                    value={form.version}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            version: e.target.value,
                                        })
                                    }
                                    placeholder="1.0.2"
                                />
                            </div>
                            <div className="admin-create-field">
                                <label>
                                    {t("admin.releaseVersionCode")}
                                </label>
                                <input
                                    type="number"
                                    value={form.versionCode ?? 0}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            versionCode: Number(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                />
                            </div>
                            <div className="admin-create-field">
                                <label>{t("admin.releaseDownloadUrl")} *</label>
                                <input
                                    type="url"
                                    value={form.downloadUrl}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            downloadUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com/app.apk"
                                />
                            </div>
                            <div className="admin-create-field">
                                <label>{t("admin.releaseNotes")}</label>
                                <textarea
                                    rows={4}
                                    value={form.releaseNotes || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            releaseNotes: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="admin-create-field admin-checkbox-row">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={!!form.forceUpdate}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                forceUpdate: e.target.checked,
                                            })
                                        }
                                    />
                                    {t("admin.releaseForceUpdate")}
                                </label>
                            </div>
                            <div className="admin-create-field admin-checkbox-row">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={form.enabled !== false}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                enabled: e.target.checked,
                                            })
                                        }
                                    />
                                    {t("admin.releaseEnabled")}
                                </label>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button
                                className="admin-btn"
                                onClick={() => setShowForm(false)}
                                disabled={saving}
                            >
                                {t("common.cancel")}
                            </button>
                            <button
                                className="admin-btn admin-btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving
                                    ? t("common.saving")
                                    : t("common.save")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
