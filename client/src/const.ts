export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * 檢測用戶是否在內建瀏覽器或 webview 中
 * 包括：LINE、Facebook、Instagram、Threads、Barcelona（Meta apps）、以及其他內建 WebView
 */
export const isInWebView = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  // LINE、Facebook、Instagram、Threads、Barcelona、TikTok 等內建瀏覽器或 webview
  return /Line|FBAN|FBAV|Instagram|Barcelona|Threads|TikTok|WeChat|QQ|Alipay/i.test(ua);
};

/**
 * 檢查是否已帶有 "openExternalBrowser" 標記
 */
export const hasOpenExternalBrowserFlag = (): boolean => {
  try {
    return new URL(window.location.href).searchParams.has('openExternalBrowser');
  } catch {
    return false;
  }
};

/**
 * 如果在內建瀏覽器中且還沒有 openExternalBrowser 標記，
 * 就加上此標記並重新載入，觸發系統瀏覽器開啟
 */
export const forceOpenInSystemBrowserIfNeeded = (): void => {
  if (!isInWebView()) return; // 不在 webview，無需強制
  if (hasOpenExternalBrowserFlag()) return; // 已標記，無需重複

  try {
    const u = new URL(window.location.href);
    u.searchParams.set('openExternalBrowser', '1');
    window.location.href = u.toString();
  } catch (e) {
    // fallback
    const sep = window.location.href.includes('?') ? '&' : '?';
    window.location.href = window.location.href + sep + 'openExternalBrowser=1';
  }
};

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  // 固定 callback path，避免把動態 query 當作 redirect_uri
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  // 開發用 log，可用來驗證 runtime 實際的 redirectUri
  try { console.debug('[Auth] generated redirectUri:', redirectUri); } catch (e) {}
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
