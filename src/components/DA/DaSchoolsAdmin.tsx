import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    getDaAdminSchools,
    createDaSchool,
    updateDaSchool,
    deleteDaSchool,
    addDaSchoolAdmin,
    removeDaSchoolAdmin,
    type DaAdminSchool,
} from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import Switch from "../ui/Switch";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
    Plus,
    Pencil,
    Trash2,
    Users,
    UserPlus,
    X,
    AlertCircle,
    Building2,
} from "lucide-react";
import "../../styles/da.css";

interface SchoolForm {
    slug: string;
    name: string;
    eventsEmail: string;
    themeColor: string;
}

const emptyForm: SchoolForm = {
    slug: "",
    name: "",
    eventsEmail: "",
    themeColor: "",
};

const DaSchoolsAdmin: React.FC = () => {
    const { t } = useTranslation();
    const [schools, setSchools] = useState<DaAdminSchool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<DaAdminSchool | null>(null);
    const [form, setForm] = useState<SchoolForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [adminsSchool, setAdminsSchool] = useState<DaAdminSchool | null>(null);
    const [newAdminEmail, setNewAdminEmail] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const list = await getDaAdminSchools();
            setSchools(list);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setFormError("");
        setModalOpen(true);
    };

    const openEdit = (s: DaAdminSchool) => {
        setEditing(s);
        setForm({
            slug: s.slug,
            name: s.name,
            eventsEmail: s.eventsEmail || "",
            themeColor: s.themeColor || "",
        });
        setFormError("");
        setModalOpen(true);
    };

    const save = async () => {
        if (!form.name.trim() || !form.slug.trim()) {
            setFormError(t("da.schoolName") + " / " + t("da.schoolSlug"));
            return;
        }
        setSaving(true);
        setFormError("");
        try {
            if (editing) {
                await updateDaSchool(editing.id, {
                    slug: form.slug.trim(),
                    name: form.name.trim(),
                    eventsEmail: form.eventsEmail.trim() || null,
                    themeColor: form.themeColor.trim() || null,
                });
            } else {
                await createDaSchool({
                    slug: form.slug.trim().toLowerCase(),
                    name: form.name.trim(),
                    eventsEmail: form.eventsEmail.trim() || undefined,
                    themeColor: form.themeColor.trim() || undefined,
                });
            }
            setModalOpen(false);
            await load();
        } catch (e: any) {
            setFormError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const toggleEnabled = async (s: DaAdminSchool) => {
        try {
            await updateDaSchool(s.id, { enabled: !s.enabled });
            await load();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const removeSchool = async (s: DaAdminSchool) => {
        if (!window.confirm(t("da.confirmDeleteSchool"))) return;
        try {
            await deleteDaSchool(s.id);
            await load();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const addAdmin = async () => {
        if (!adminsSchool) return;
        if (!/^\S+@\S+\.\S+$/.test(newAdminEmail.trim())) {
            setError(t("da.adminEmail"));
            return;
        }
        try {
            await addDaSchoolAdmin(adminsSchool.id, newAdminEmail.trim());
            setNewAdminEmail("");
            const fresh = await getDaAdminSchools();
            setSchools(fresh);
            setAdminsSchool(fresh.find((f) => f.id === adminsSchool.id) || null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const removeAdmin = async (email: string) => {
        if (!adminsSchool) return;
        try {
            await removeDaSchoolAdmin(adminsSchool.id, email);
            const fresh = await getDaAdminSchools();
            setSchools(fresh);
            setAdminsSchool(fresh.find((f) => f.id === adminsSchool.id) || null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="da-admin">
            <div className="da-admin-header">
                <h2>
                    <Building2 size={22} style={{ verticalAlign: "middle", marginRight: 8 }} />
                    {t("da.schoolsManage")}
                </h2>
                <Button onClick={openCreate}>
                    <Plus size={16} style={{ marginRight: 6 }} />
                    {t("da.addSchool")}
                </Button>
            </div>

            {error && (
                <div className="da-error" style={{ padding: 8, marginBottom: 16 }}>
                    <AlertCircle size={18} />
                    <p style={{ margin: 0, fontSize: "0.85rem" }}>{error}</p>
                </div>
            )}

            {loading ? (
                <LoadingSpinner text={t("common.loading")} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>{t("da.allSchools")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {schools.length === 0 && (
                            <div className="da-empty">{t("da.noEvents")}</div>
                        )}
                        {schools.map((s) => (
                            <div key={s.id} className="da-admin-list-item">
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="da-row-title">{s.name}</div>
                                    <div className="da-row-sub">
                                        /{s.slug}/events · {s.daAccountEmail}
                                    </div>
                                    <div className="da-row-sub">
                                        {s.eventsEmail || t("da.schoolEmail")}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        flexShrink: 0,
                                    }}
                                >
                                    <Switch
                                        checked={s.enabled}
                                        onChange={() => toggleEnabled(s)}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAdminsSchool(s)}
                                        title={t("da.admins")}
                                    >
                                        <Users size={15} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEdit(s)}
                                    >
                                        <Pencil size={15} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSchool(s)}
                                        title={t("common.delete")}
                                    >
                                        <Trash2 size={15} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* 新增/编辑学校 */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? t("da.editEvent") : t("da.addSchool")}
            >
                <div className="da-form">
                    <div className="da-form-row">
                        <label>{t("da.schoolName")}</label>
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder="西交利物浦大学"
                        />
                    </div>
                    <div className="da-form-row">
                        <label>{t("da.schoolSlug")}</label>
                        <Input
                            value={form.slug}
                            onChange={(e) =>
                                setForm({ ...form, slug: e.target.value })
                            }
                            placeholder="xjtlu"
                            disabled={!!editing}
                        />
                    </div>
                    <div className="da-form-row">
                        <label>{t("da.schoolEmail")}</label>
                        <Input
                            value={form.eventsEmail}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    eventsEmail: e.target.value,
                                })
                            }
                            placeholder="da.events@apoints.cn"
                        />
                    </div>
                    <div className="da-form-row">
                        <label>{t("da.schoolTheme")}</label>
                        <Input
                            value={form.themeColor}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    themeColor: e.target.value,
                                })
                            }
                            placeholder="#2563eb"
                        />
                    </div>
                    {formError && (
                        <div className="da-error" style={{ padding: 8 }}>
                            <p style={{ margin: 0, fontSize: "0.85rem" }}>
                                {formError}
                            </p>
                        </div>
                    )}
                    <div className="da-form-actions">
                        <Button
                            variant="ghost"
                            onClick={() => setModalOpen(false)}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button onClick={save} disabled={saving}>
                            {saving ? t("common.saving") : t("common.save")}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* 管理员管理 */}
            <Modal
                isOpen={!!adminsSchool}
                onClose={() => setAdminsSchool(null)}
                title={
                    (adminsSchool?.name || "") + " · " + t("da.admins")
                }
            >
                {adminsSchool && (
                    <div className="da-form">
                        {(adminsSchool.admins || []).map((email) => (
                            <div key={email} className="da-row">
                                <div>
                                    <div className="da-row-title">{email}</div>
                                    <div className="da-row-sub">
                                        {t("da.admins")}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAdmin(email)}
                                >
                                    <X size={15} />
                                </Button>
                            </div>
                        ))}
                        {(!adminsSchool.admins ||
                            adminsSchool.admins.length === 0) && (
                            <div className="da-empty" style={{ padding: 16 }}>
                                {t("da.noEvents")}
                            </div>
                        )}
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                            }}
                        >
                            <Input
                                value={newAdminEmail}
                                onChange={(e) =>
                                    setNewAdminEmail(e.target.value)
                                }
                                placeholder={t("da.adminEmail")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") addAdmin();
                                }}
                            />
                            <Button onClick={addAdmin}>
                                <UserPlus size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DaSchoolsAdmin;
