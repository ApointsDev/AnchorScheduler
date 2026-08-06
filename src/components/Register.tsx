import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 注册页面已禁用 — 仅允许通过 CAF 统一认证登录。
 * 访问 /register 将自动重定向到 /login。
 */
const Register: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/login", { replace: true });
    }, [navigate]);

    return null;
};

export default Register;
