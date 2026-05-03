import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { login, setToken, authEvents, startCafAuth } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import '../styles/AuthForms.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cafLoading, setCafLoading] = useState(false);
  const callbackHandledRef = useRef(false);

  useEffect(() => {
    if (callbackHandledRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const callbackToken = params.get('token');
    const cafError = params.get('caf_error');

    if (cafError) {
      setError(cafError);
      params.delete('caf_error');
      const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', nextUrl);
      callbackHandledRef.current = true;
      return;
    }

    if (callbackToken) {
      setToken(callbackToken);
      try { authEvents.dispatchEvent(new Event('login')); } catch (_) {}
      params.delete('token');
      params.delete('from');
      const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', nextUrl);
      callbackHandledRef.current = true;
      onLoginSuccess();
    }
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      setToken(response.token);
      // notify global listeners that login happened so contexts can refresh
      try { authEvents.dispatchEvent(new Event('login')); } catch (_) {}
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleCafLogin = () => {
    setCafLoading(true);
    startCafAuth();
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle style={{ justifyContent: 'center' }}>登录</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <Input
              label="邮箱"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="密码"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="auth-button-full" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? '登录中...' : '登录'}
            </Button>
            <Button
              type="button"
              className="auth-button-full"
              disabled={cafLoading}
              onClick={handleCafLogin}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {cafLoading ? '跳转 CAF 中...' : '使用 CAF 登录'}
            </Button>
          </form>
          <div className="switch-auth-link">
            <span>没有账户？ </span>
            <Link to="/register">立即注册</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
