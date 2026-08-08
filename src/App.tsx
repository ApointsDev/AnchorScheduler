import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { WeekProvider } from "./context/WeekContext";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import {
    isAuthenticated,
    removeToken,
    removeRefreshToken,
    authEvents,
    getOnboardingStatus,
    setOnboardingCompleted,
} from "./services/api";
import { checkAdmin } from "./services/adminApi";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ShareView from "./components/Share/ShareView";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/Button";
import "./App.css";
import ScheduleQueueNotifier from "./components/ScheduleQueueNotifier";
import Onboarding from "./components/Onboarding";
import AdminPanel from "./components/Admin/AdminPanel";

function App() {
    const { t } = useTranslation();
    const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isCheckingAuth, setIsCheckingAuth] =
        useState<boolean>(isAuthenticated());
    const [showSessionExpiredModal, setShowSessionExpiredModal] =
        useState(false);
    const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

    useEffect(() => {
        const handleUnauthorized = () => {
            setShowSessionExpiredModal(true);
        };

        authEvents.addEventListener("unauthorized", handleUnauthorized);

        // 初始化时检查管理员权限，完成前阻塞路由渲染，防止竞态导致错误重定向
        if (isAuthenticated()) {
            checkAdmin()
                .then(setIsAdmin)
                .catch(() => setIsAdmin(false))
                .finally(() => setIsCheckingAuth(false));

            // 从数据库加载引导页完成状态（替代 localStorage）
            getOnboardingStatus().then((completed) => {
                if (!completed) setShowOnboarding(true);
            });
        } else {
            setIsCheckingAuth(false);
        }

        return () => {
            authEvents.removeEventListener("unauthorized", handleUnauthorized);
        };
    }, []);

    const handleLoginSuccess = async () => {
        setIsAuth(true);
        setIsCheckingAuth(true);
        // 登录后检查管理员权限，完成前阻塞路由渲染
        try {
            const admin = await checkAdmin();
            setIsAdmin(admin);
        } catch {
            setIsAdmin(false);
        } finally {
            setIsCheckingAuth(false);
        }

        // 从数据库加载引导页完成状态
        getOnboardingStatus().then((completed) => {
            if (!completed) setShowOnboarding(true);
        });
    };

    const handleLogout = () => {
        removeToken();
        removeRefreshToken();
        setIsAuth(false);
        setIsAdmin(false);
    };

    const handleOnboardingComplete = () => {
        setOnboardingCompleted(true);
        setShowOnboarding(false);
    };

    const handleSessionExpired = () => {
        setShowSessionExpiredModal(false);
        handleLogout();
    };

    // 正在检查权限中，先显示加载态，避免 isAdmin 初始值 false 导致 /admin 被错误重定向
    if (isCheckingAuth) {
        return (
            <Router>
                <div
                    className="app-container"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                    }}
                >
                    <LoadingSpinner />
                </div>
            </Router>
        );
    }

    return (
        <Router>
            <WeekProvider>
                <div className="app-container">
                    <ScheduleQueueNotifier />
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                !isAuth ? (
                                    <Login
                                        onLoginSuccess={handleLoginSuccess}
                                    />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />
                        {/* 注册已禁用 — 仅允许 CAF 登录，/register 重定向到 /login */}
                        <Route
                            path="/register"
                            element={<Navigate to="/login" replace />}
                        />

                        <Route
                            path="/"
                            element={
                                isAuth ? (
                                    showOnboarding ? (
                                        <Navigate to="/onboarding" />
                                    ) : (
                                        <Navigate to="/schedule/today" />
                                    )
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/onboarding"
                            element={
                                isAuth ? (
                                    <Onboarding
                                        onComplete={handleOnboardingComplete}
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                isAuth ? (
                                    <Dashboard
                                        onLogout={handleLogout}
                                        view="dashboard"
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/schedule/today"
                            element={
                                isAuth ? (
                                    <Dashboard
                                        onLogout={handleLogout}
                                        view="today-schedule"
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/schedule/all"
                            element={
                                isAuth ? (
                                    <Dashboard
                                        onLogout={handleLogout}
                                        view="all-schedule"
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/schedule/search"
                            element={
                                isAuth ? (
                                    <Dashboard
                                        onLogout={handleLogout}
                                        view="search-schedule"
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/schedule/queue"
                            element={
                                isAuth ? (
                                    <Dashboard
                                        onLogout={handleLogout}
                                        view="queue"
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/chat"
                            element={
                                isAuth ? (
                                    <Dashboard
                                        onLogout={handleLogout}
                                        view="chat"
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/logs"
                            element={
                                isAuth ? (
                                    <Dashboard
                                        onLogout={handleLogout}
                                        view="logs"
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/mail"
                            element={
                                isAuth ? (
                                    <Dashboard
                                        onLogout={handleLogout}
                                        view="mail"
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                isAuth && isAdmin ? (
                                    <AdminPanel />
                                ) : (
                                    <Navigate to="/dashboard" />
                                )
                            }
                        />

                        <Route
                            path="/settings/membership"
                            element={
                                isAuth ? (
                                    <Dashboard
                                        onLogout={handleLogout}
                                        view="membership"
                                    />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />

                        <Route path="/share/:token" element={<ShareView />} />

                        <Route
                            path="*"
                            element={
                                isAuth ? (
                                    <Navigate to="/dashboard" />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                    </Routes>

                    <Modal
                        isOpen={showSessionExpiredModal}
                        onClose={() => {}}
                        title={t("app.sessionExpired")}
                        closeOnOverlayClick={false}
                    >
                        <p>{t("app.sessionExpiredDesc")}</p>
                        <div
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button onClick={handleSessionExpired}>
                                {t("app.relogin")}
                            </Button>
                        </div>
                    </Modal>
                </div>
            </WeekProvider>
        </Router>
    );
}

export default App;
