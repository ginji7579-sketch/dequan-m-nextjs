# OAuth popup-first 修正分支與本機測試說明

本文檔說明我已套用的變更、如何建立 commit/branch，及在本機測試的步驟與範例 env。請依序操作。

## 1) 我建議的 branch / commit

分支名稱（建議）：

  feature/oauth-popup-first-fix

建立分支並提交目前變更的指令範例：

```bash
# 從 main 或你要的 base branch 建分支
git checkout -b feature/oauth-popup-first-fix

# 檢查變更
git status
git add client/src/const.ts client/src/contexts/AuthContext.tsx client/src/lib/firebase.ts client/src/pages/Login.tsx

# commit
git commit -m "feat(auth): popup-first login, fixed callback path, add open-in-system-browser flow"

# push
git push -u origin feature/oauth-popup-first-fix
```

如果你使用 VS Code 的 Source Control，可以用 GUI 完成相同步驟。

## 2) 必要的環境變數範例（在本機使用 .env 文件）

請在專案根目錄建立 `.env.local`（或依專案慣例命名），內容範例：

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=dequan-m.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_msg_sender
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXX

# OAuth portal (如果使用自家 oauth portal)
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.example.com
VITE_APP_ID=your_app_id_for_portal
```

注意：不要把機密（例如 production 的敏感 key）推到公開 git；本機測試可以使用開發用 firebase 設定或 emulator。

## 3) 本機啟動與測試（Vite）

假設此專案使用 Vite（`package.json` 已有開發指令）。

```bash
# 安裝依賴（如尚未）
npm install

# 啟動開發伺服器
npm run dev
```

測試流程：

- 開啟瀏覽器至 `http://localhost:5173`（或 `http://localhost:3000`，視專案啟動 port）。
- 前往 `/login` 頁面，點「使用 Google 登入」。
  - 若彈窗被允許，應該會以 popup 完成登入並導向 `/admin`。
  - 若彈窗被阻擋或在內嵌 webview，會顯示「以系統瀏覽器開啟（推薦）」按鈕，點擊後會把 URL 加上 `openExternalBrowser=1` 並重新導向以用系統瀏覽器開啟流程。

在開發 console 中可看到 debug log：`[Auth] generated redirectUri: ...`，用以確認 runtime 實際的 redirectUri。

## 4) 要在 Google Cloud Console / Firebase 註冊的 redirect URIs

根據目前實作（固定 callback path 為 `/api/oauth/callback`，以及 Firebase 的 handler `__/auth/handler`），請在 Google Cloud Console / Firebase Auth 的 Authorized redirect URIs 中加入：

- https://dequan-m.vercel.app/api/oauth/callback
- https://dequan-m.vercel.app/__/auth/handler
- https://dequan-m.firebaseapp.com/__/auth/handler
- 本機測試（視 dev server port）例如：
  - http://localhost:5173/api/oauth/callback
  - http://localhost:3000/api/oauth/callback

如果你的 app 在發送 redirect 有包含其他 query 參數（請盡量避免），要麼把完整 URI 加到 Console，要麼改為把 state 存在 storage 而不是 query 中（本專案已採後者）。

## 5) 測試注意事項

- 確保瀏覽器允許第三方 Cookie 或在測試時使用 Chrome（行動 Safari 及某些 webview 可能因 ITP/設定導致行為不同）。
- 若使用 Firebase Emulator，請確認 `authDomain` 與本機設定相符，或使用 emulator 的啟動方式。
- 如果遇到 `redirect_uri_mismatch`，在 Console 看到的 `redirect_uri` 字串應與上述註冊的完全相同（包含 scheme、host、port、path）。

## 6) 還要我做的事（選項）

- 我可以幫你建立 PR 並在 commit 訊息中說明變更（需要 repo push 權限）。
- 我可以把 `open in system browser` 按鈕改成更顯眼的 modal 或加入 i18n。

---
如果你要我幫你建立 PR 或需要調整 `.env` 範例裡的內容，回覆我就行。