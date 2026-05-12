import isWebview from 'is-webview';

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

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
 * 檢測用戶是否在內建瀏覽器或 webview 中
 * 使用專業庫 is-webview 進行準確檢測
 */
export const isInWebView = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  // 如果已經透過 openExternalBrowser=1 強制跳轉，則視為外部瀏覽器
  if (hasOpenExternalBrowserFlag()) return false;
  // 使用專業庫檢測 WebView
  return isWebview(navigator.userAgent);
};

/**
 * 如果在內建瀏覽器中且還沒有 openExternalBrowser 標記，
 * 就加上此標記並重新載入，觸發系統瀏覽器開啟（主要用於 LINE）
 */
export const forceOpenInSystemBrowserIfNeeded = (): void => {
  if (!isInWebView()) return;
  if (hasOpenExternalBrowserFlag()) return;

  try {
    const u = new URL(window.location.href);
    u.searchParams.set('openExternalBrowser', '1');
    window.location.href = u.toString();
  } catch (e) {
    const sep = window.location.href.includes('?') ? '&' : '?';
    window.location.href = window.location.href + sep + 'openExternalBrowser=1';
  }
};

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  try { console.debug('[Auth] generated redirectUri:', redirectUri); } catch (e) { }
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};