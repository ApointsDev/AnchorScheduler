import { useState, useEffect } from "react";
import { WeekProvider } from "./context/WeekContext";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { isAuthenticated, removeToken, authEvents } from "./services/api";
import { checkAdmin } from "./services/adminApi";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/Button";
import "./App.css";
import ScheduleQueueNotifier from "./components/ScheduleQueueNotifier";
import Onboarding from "./components/Onboarding";
import AdminPanel from "./components/Admin/AdminPanel";

function App() {
    const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isCheckingAuth, setIsCheckingAuth] =
        useState<boolean>(isAuthenticated());
    const [showSessionExpiredModal, setShowSessionExpiredModal] =
        useState(false);
    const [showOnboarding, setShowOnboarding] = useState(() => {
        return !localStorage.getItem("onboarding_completed");
    });

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
    };

    const handleLogout = () => {
        removeToken();
        setIsAuth(false);
        setIsAdmin(false);
    };

    const handleOnboardingComplete = () => {
        localStorage.setItem("onboarding_completed", "true");
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
                    <p>加载中…</p>
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
                        <Route
                            path="/register"
                            element={
                                !isAuth ? (
                                    <Register
                                        onRegisterSuccess={handleLoginSuccess}
                                    />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />

                        <Route
                            path="/"
                            element={
                                isAuth ? (
                                    showOnboarding ? (
                                        <Navigate to="/onboarding" />
                                    ) : (
                                        <Navigate to="/dashboard" />
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
                        onClose={() => {}} // Prevent closing by clicking outside
                        title="会话已过期"
                        closeOnOverlayClick={false}
                    >
                        <p>您的登录会话已过期，请重新登录。</p>
                        <div
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button onClick={handleSessionExpired}>
                                重新登录
                            </Button>
                        </div>
                    </Modal>
                </div>
            </WeekProvider>
        </Router>
    );
}

export default App;
