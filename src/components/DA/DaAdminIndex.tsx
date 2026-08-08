import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getDaAdminMySchools, type DaAdminSchool } from "../../services/api";
import { Card, CardContent } from "../ui/Card";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ArrowRight, AlertCircle, Building2 } from "lucide-react";
import "../../styles/da.css";

const DaAdminIndex: React.FC = () => {
    const { t } = useTranslation();
    const [schools, setSchools] = useState<DaAdminSchool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getDaAdminMySchools()
            .then(setSchools)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="da-admin">
            <div className="da-admin-header">
                <h2>
                    <Building2 size={22} style={{ verticalAlign: "middle", marginRight: 8 }} />
                    {t("da.events")}
                </h2>
            </div>

            {loading ? (
                <LoadingSpinner text={t("common.loading")} />
            ) : error ? (
                <div className="da-error">
                    <AlertCircle size={40} />
                    <p>{error}</p>
                </div>
            ) : (
                <div className="da-school-grid">
                    {schools.map((s) => (
                        <Link
                            key={s.id}
                            to={`/admin/da/${s.slug}`}
                            className="da-school-card"
                        >
                            <Card className="da-school-card-inner">
                                <CardContent>
                                    <div className="da-school-name">
                                        {s.name}
                                    </div>
                                    <div className="da-school-mail">
                                        <span className="da-row-sub">
                                            /{s.slug}/events
                                        </span>
                                        {!s.enabled && (
                                            <span className="da-row-sub">
                                                · {t("common.disabled")}
                                            </span>
                                        )}
                                    </div>
                                    <div className="da-school-cta">
                                        <span>{t("da.edit")}</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {schools.length === 0 && (
                        <div className="da-empty">
                            <AlertCircle size={36} />
                            <p>{t("da.noEvents")}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DaAdminIndex;
