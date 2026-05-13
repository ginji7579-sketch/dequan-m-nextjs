# OAuth Run-time 驗證指引

此文件提供幾個快速驗證步驟與可貼到瀏覽器 Console 的 snippet，用來確認運行時實際傳出的 `redirect_uri`、`authDomain` 等資訊。

## 1) 建立 branch 與 commit（建議）

```bash
git checkout -b feature/oauth-popup-first-fix
git add client/src/const.ts client/src/contexts/AuthContext.tsx client/src/lib/firebase.ts client/src/pages/Login.tsx OAUTH-PATCH-README.md TEST_OAUTH_RUNTIME.md
git commit -m "feat(auth): popup-first flow, fixed callback path, open-in-system-browser guide"
git push -u origin feature/oauth-popup-first-fix
```

然後在 GitHub/GitLab 上從 `feature/oauth-popup-first-fix` 建 PR，PR 標題與描述可用下方建議。

### PR 描述建議

Title: feat(auth): popup-first flow, fixed callback path, open-in-system-browser guide

Description:
- 保持 `signInWithRedirect` 為主要流程，不自動 fallback 至 redirect（避免 `redirect_uri_mismatch`）。
- 固定 OAuth callback path 為 `/api/oauth/callback`（由 `client/src/const.ts` 產生），並在 runtime 印出 `redirectUri` 供 debug。
- 優先使用 `VITE_FIREBASE_AUTH_DOMAIN`（若有設定），否則回退到現有的 host 偵測或 `<projectId>.firebaseapp.com`。
- 在登入頁面加入「以系統瀏覽器開啟（推薦）」按鈕，當彈窗被阻擋或發生 internal-error 時顯示，引導用戶在系統瀏覽器重試。

---

## 2) 在瀏覽器 Console 驗證 runtime redirectUri 與 authDomain

1. 啟動開發伺服器 (`npm run dev`) 並開啟 `http://localhost:5173/login`。
2. 在 Console 貼入下列 snippet，查看輸出：

```js
// 顯示 window.location.origin, firebase auth domain, 以及由 getLoginUrl 產生的 redirectUri
console.log('origin =', window.location.origin);
try {
  // firebase auth object 在本專案用 export name `auth`
  console.log('auth config authDomain =', window.__firebaseAuthDomain || (window.firebase && firebase.app && firebase.app().options && firebase.app().options.authDomain));
} catch(e) {}

// 如果有載入應用，可以直接呼叫 getLoginUrl（dev build 有可能 tree-shake，若不可用請在 client/src/const.ts 加上 debug log）
try { console.log('getLoginUrl =>', window.__getLoginUrl && window.__getLoginUrl()); } catch(e) { console.warn('getLoginUrl not exposed; rely on console.debug from getLoginUrl'); }
```

> 如果 `getLoginUrl` 在全域不可存取，你會在 dev console 中看到 `console.debug('[Auth] generated redirectUri:', ...)` 的訊息（來自 `client/src/const.ts` 的 debug log）。

## 3) 檢查 Popup 行為

- 點擊「使用 Google 登入」：若 popup 被允許，會開一個新視窗進行 Google OAuth；完成後回到原視窗並導向 `/admin`。
- 若 popup 被阻擋或發生 `auth/internal-error`，在 UI 上會顯示錯誤訊息與「以系統瀏覽器開啟（推薦）」按鈕。
  - 點按後，頁面會以 `openExternalBrowser=1` 重新導向，讓外部瀏覽器處理流程。

## 4) 確認 Google Console 的 redirect URI

當你在 Google Cloud Console 或 Firebase Auth 裡看到 `redirect_uri_mismatch`，請比對 Console 中顯示的 `redirect_uri` 與你在 OAuth 設定裡註冊的項目（完全相符，包括 scheme、host、port、path 與 query）。

如需我幫你檢查 `redirect_uri` 字串，你可以把發生錯誤時瀏覽器顯示的 `redirect_uri` 貼給我，我會指出應該要在 Console 裡加哪一條。

---

如果你要我直接幫你建立 PR（在 remote push 後自動建立 PR），請在這裡授權並提供（或確認） repo 的遠端名稱與 base branch（例如 `origin`、`main`）。