import { useState, useEffect, type FormEvent } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LineIcon } from '@/components/LineIcon';
import { isInWebView, hasOpenExternalBrowserFlag } from '@/const';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { login, loginWithGoogle, user, loading, sessionUser } = useAuth();

  const inWebView = isInWebView();
  const hasExternalFlag = hasOpenExternalBrowserFlag();

  // 當使用者登入成功時自動導向 /admin
  const isLoggedIn = Boolean(user) || Boolean(sessionUser);
  useEffect(() => {
    if (!loading && isLoggedIn) {
      setLocation('/admin');
    }
  }, [isLoggedIn, loading, setLocation, sessionUser, user]);

  // 監聽 server-side OAuth popup 回傳的訊息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'oauth-success') {
        console.log('✅ OAuth popup 登入成功，重新檢查 session');
        setOauthLoading(false);
        // 刷新頁面以確保 cookie 被正確讀取
        window.location.reload();
      }
      if (event.data?.type === 'oauth-error') {
        console.error('❌ OAuth popup 登入失敗:', event.data.error);
        setOauthLoading(false);
        setError('Google 登入失敗，請稍後再試');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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

    // 🛡️ 阻止在 WebView 中登入（除非已有 openExternalBrowser 標記）
    if (inWebView && !hasExternalFlag) {
      setError('請使用系統瀏覽器登入。請點擊下方「使用系統瀏覽器開啟」或「複製連結」後，在 Chrome / Safari 中開啟。');
      return;
    }

    // 🚀 使用 server-side OAuth popup 方式（避免 Firebase client-side redirect 的 iOS 問題）
    setOauthLoading(true);
    
    // 開啟 popup 視窗到 server-side OAuth endpoint
    const popup = window.open('/api/oauth/authorize', 'google-login', 'width=500,height=600');
    
    // 如果 popup 被阻擋，fallback 到 Firebase redirect
    if (!popup || popup.closed) {
      setOauthLoading(false);
      console.log('ℹ️ Popup 被阻擋，改用 Firebase redirect 方式');
      try {
        await loginWithGoogle();
      } catch (err: any) {
        setError(err.message || 'Google 登入失敗，請稍後再試');
      }
      return;
    }

    // 設定 timeout：若 popup 在 60 秒內沒回應，讓使用者可以重試
    setTimeout(() => {
      if (oauthLoading) {
        setOauthLoading(false);
        setError('登入逾時，請關閉彈出視窗後重新點擊 Google 登入');
      }
    }, 60000);
  };

  const handleLineLogin = () => {
    setError('');

    // 🛡️ 同樣阻止 WebView 中的 LINE 登入
    if (inWebView && !hasExternalFlag) {
      setError('請使用系統瀏覽器登入。請點擊下方「使用系統瀏覽器開啟」或「複製連結」後，在 Chrome / Safari 中開啟。');
      return;
    }

    window.location.href = '/api/oauth/authorize?provider=line';
  };

  const handleOpenInSystemBrowser = () => {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set('openExternalBrowser', '1');
      window.location.href = u.toString();
    } catch {
      const sep = window.location.href.includes('?') ? '&' : '?';
      window.location.href = window.location.href + sep + 'openExternalBrowser=1';
    }
  };

  const handleCopyLink = async () => {
    try {
      // 複製當前網址（不含 openExternalBrowser 參數，避免複製後仍強制跳轉）
      const cleanUrl = window.location.href.split('?')[0];
      await navigator.clipboard.writeText(cleanUrl);
      setError('✅ 連結已複製！請貼到手機的 Chrome / Safari 瀏覽器中開啟。');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      setError('無法複製連結，請手動複製網址列。');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#E8E6E1] p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#2B8A8A' }}>會員登入</h1>
            <p className="text-[#2C3E50] text-sm">歡迎回到德全，請輸入您的帳號密碼</p>
            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* WebView 警告區域 */}
          {inWebView && !hasExternalFlag && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium mb-2">
                ⚠️ 您正在使用應用程式內建瀏覽器
              </p>
              <p className="text-xs text-amber-700 mb-3">
                Google 與 LINE 登入無法在此環境進行，請改用系統瀏覽器。
              </p>
              <button
                type="button"
                onClick={handleOpenInSystemBrowser}
                className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors mb-2"
              >
                使用系統瀏覽器開啟
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2 px-4 rounded-lg text-sm font-medium border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors"
              >
                複製連結，手動到瀏覽器貼上
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">電子郵件</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E6E1] focus:outline-none focus:ring-2 focus:ring-[#2B8A8A] focus:border-transparent transition-all bg-[#FAFAFA] text-sm"
                placeholder="請輸入 Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">密碼</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E6E1] focus:outline-none focus:ring-2 focus:ring-[#2B8A8A] focus:border-transparent transition-all bg-[#FAFAFA] text-sm"
                placeholder="請輸入密碼"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg text-white font-medium transition-transform active:scale-[0.98] hover:opacity-90 text-sm"
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

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-lg border border-[#E8E6E1] font-medium transition-colors hover:bg-[#F5F1E8] flex items-center justify-center gap-3 text-sm"
              style={{ color: '#2C3E50' }}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
              <span>使用 Google 登入</span>
            </button>

            <button
              type="button"
              onClick={handleLineLogin}
              className="w-full py-3 px-4 rounded-lg font-medium transition-colors hover:opacity-90 flex items-center justify-center gap-3 text-sm text-white"
              style={{ backgroundColor: '#06C755' }}
            >
              <LineIcon className="w-5 h-5 flex-shrink-0" />
              <span>使用 LINE 登入</span>
            </button>
          </div>

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