export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

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
