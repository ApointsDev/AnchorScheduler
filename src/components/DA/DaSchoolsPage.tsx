import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getDaSchools, type School } from "../../services/api";
import { Card, CardContent } from "../ui/Card";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Calendar, Mail, AlertCircle, ArrowRight } from "lucide-react";
import logo from "../../assets/logo.svg";
import "../../styles/da.css";

const DaSchoolsPage: React.FC = () => {
    const { t } = useTranslation();
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getDaSchools()
            .then(setSchools)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="da-page da-landing">
            <div className="da-landing-header">
                <div className="da-landing-logo">
                    <img src={logo} alt="APoints" className="da-logo" />
                    <span className="da-brand">APoints</span>
                </div>
                <div className="da-landing-title-wrap">
                    <h1 className="da-landing-title">
                        <Calendar size={26} />
                        {t("da.landingTitle")}
                    </h1>
                    <p className="da-landing-intro">{t("da.landingIntro")}</p>
                </div>
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
                            to={`/${s.slug}/events`}
                            className="da-school-card"
                            style={
                                s.themeColor
                                    ? ({ "--da-accent": s.themeColor } as React.CSSProperties)
                                    : undefined
                            }
                        >
                            <Card className="da-school-card-inner">
                                <CardContent>
                                    <div className="da-school-name">
                                        {s.name}
                                    </div>
                                    {s.eventsEmail && (
                                        <div className="da-school-mail">
                                            <Mail size={14} />
                                            <span>{s.eventsEmail}</span>
                                        </div>
                                    )}
                                    <div className="da-school-cta">
                                        <span>{t("da.events")}</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {schools.length === 0 && (
                        <div className="da-empty">
                            {t("da.noEvents")}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DaSchoolsPage;
