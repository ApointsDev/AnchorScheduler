import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { setToken, authEvents, startCafAuth } from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import "../styles/AuthForms.css";

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const { t } = useTranslation();
    const [error, setError] = useState("");
    const [cafLoading, setCafLoading] = useState(false);
    const callbackHandledRef = useRef(false);

    useEffect(() => {
        if (callbackHandledRef.current) return;

        const params = new URLSearchParams(window.location.search);
        const callbackToken = params.get("token");
        const cafError = params.get("caf_error");

        if (cafError) {
            setError(cafError);
            params.delete("caf_error");
            const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
            window.history.replaceState({}, "", nextUrl);
            callbackHandledRef.current = true;
            return;
        }

        if (callbackToken) {
            setToken(callbackToken);
            const callbackEmail = params.get("email");
            if (callbackEmail) {
                localStorage.setItem("user_email", callbackEmail);
                params.delete("email");
            }
            try {
                authEvents.dispatchEvent(new Event("login"));
            } catch (_) {}
            params.delete("token");
            params.delete("from");
            const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
            window.history.replaceState({}, "", nextUrl);
            callbackHandledRef.current = true;
            onLoginSuccess();
        }
    }, [onLoginSuccess]);

    const handleCafLogin = () => {
        setCafLoading(true);
        startCafAuth();
    };

    return (
        <div className="auth-container">
            <Card className="auth-card">
                <CardHeader>
                    <CardTitle style={{ justifyContent: "center" }}>
                        {t("auth.login")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <div className="error-message">{error}</div>}
                    <p
                        style={{
                            textAlign: "center",
                            color: "var(--color-text-secondary)",
                            marginBottom: "16px",
                        }}
                    >
                        {t("auth.cafLoginHint")}
                    </p>
                    <Button
                        type="button"
                        className="auth-button-full"
                        disabled={cafLoading}
                        onClick={handleCafLogin}
                        style={{ width: "100%" }}
                    >
                        {cafLoading
                            ? t("auth.cafRedirecting")
                            : t("auth.cafLogin")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
