import { useState, type FormEvent } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      setLocation('/admin');
    } catch (err: any) {
      setError(err.message || '登入失敗，請稍後再試');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const mode = await loginWithGoogle('/admin');
      if (mode === 'popup') {
        setLocation('/admin');
      }
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/argument-error') {
        setError(
          'Firebase 設定異常（常見：Vercel 缺少 VITE_FIREBASE_* 或金鑰為空）。請到 Vercel 專案 Environment Variables 檢查後重新部署。'
        );
      } else {
        setError(err.message || 'Google 登入失敗，請稍後再試');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#E8E6E1] p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#2B8A8A' }}>會員登入</h1>
            <p className="text-[#2C3E50] text-sm">歡迎回到德全，請輸入您的帳號密碼</p>
            {error && (
              <p className="mt-4 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                電子郵件
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E6E1] focus:outline-none focus:ring-2 focus:ring-[#2B8A8A] focus:border-transparent transition-all bg-[#FAFAFA]"
                placeholder="請輸入 Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                密碼
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E6E1] focus:outline-none focus:ring-2 focus:ring-[#2B8A8A] focus:border-transparent transition-all bg-[#FAFAFA]"
                placeholder="請輸入密碼"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg text-white font-medium transition-transform active:scale-[0.98]"
              style={{ backgroundColor: '#2B8A8A' }}
            >
              登入
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8E6E1' }}></div>
            <span className="text-xs text-[#2C3E50]">或</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8E6E1' }}></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-lg border border-[#E8E6E1] font-medium transition-colors hover:bg-[#F5F1E8] flex items-center justify-center gap-2"
            style={{ color: '#2C3E50' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            使用 Google 登入
          </button>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">還沒有帳號嗎？</span>
            <Link href="/register">
              <a className="ml-2 font-medium hover:underline" style={{ color: '#F5A623' }}>
                立即註冊
              </a>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
