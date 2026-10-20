# 🚀 安全上傳檢查清單

## 上傳前必須完成的檢查

### ✅ 敏感文件檢查

- [ ] `.env` 已在 `.gitignore` 中
- [ ] `.env.local` 已在 `.gitignore` 中
- [ ] `.env.example` 創建（不含真實密鑰）
- [ ] 執行 `npm run security-check` 無錯誤
- [ ] Git 歷史中未包含 `.env` 文件

### ✅ 代碼檢查

- [ ] 無硬編碼的 API 密鑰
- [ ] 無硬編碼的數據庫連接字符串
- [ ] 無硬編碼的密碼或令牌
- [ ] 所有敏感配置使用環境變量

### ✅ 項目配置

- [ ] `package.json` 已更新版本號
- [ ] `CHANGELOG.md` 已更新
- [ ] `.gitignore` 包含所有敏感文件
- [ ] 無 IDE 特定文件被提交（.vscode/settings.json 等）

### ✅ 構建檢查

- [ ] 本地構建成功：`npm run build:docs`
- [ ] 無構建警告或錯誤
- [ ] `dist/` 和 `build/` 目錄在 `.gitignore` 中

### ✅ Git 檢查

```bash
# 檢查將被提交的文件
git diff --cached --name-only

# 檢查未暫存的更改
git diff --name-only

# 檢查本地修改
git status
```

## 上傳步驟

### 1️⃣ 運行安全檢查
```bash
node scripts/security-check.js
```

### 2️⃣ 暫存修改
```bash
git add .
```

### 3️⃣ 提交更改
```bash
git commit -m "feat: 性能優化和安全加固

- 優化 Vite 構建配置（代碼分割、壓縮）
- 移除 Hero Section 中的 backgroundAttachment fixed（手機效能優化）
- 實施頁面組件代碼分割（lazy loading）
- 優化圖片加載和 HTML 性能指標
- 添加 Service Worker 緩存策略
- 改進安全配置和環境變量管理"
```

### 4️⃣ 推送到遠程
```bash
git push origin main
```

## 部署到 Vercel

> 綠界結帳需要 `/api/payments/ecpay/checkout` 伺服器 API。GitHub Pages 僅支援靜態檔案，無法處理此 API；請將前端與 `api/` Functions 一起部署至 Vercel 或其他支援伺服器 API 的平台。

### 設置環境變量（重要！）

1. 進入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇項目 → Settings → Environment Variables
3. 添加以下環境變量：

```
# Firebase
VITE_FIREBASE_API_KEY=your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Ecpay
ECPAY_MERCHANT_ID=your_merchant_id
ECPAY_HASH_KEY=your_hash_key
ECPAY_HASH_IV=your_hash_iv
ECPAY_STAGE=true

# Stripe
STRIPE_SECRET_KEY=your_secret_key
```

### 部署

```bash
git push origin main
```

Vercel 會自動部署。無需手動推送 `.env` 文件！

## 洩漏應急檢查清單

如果不小心洩漏了敏感信息，立即執行：

### ❌ 發現洩漏

- [ ] 立即通知安全團隊
- [ ] 停止使用該密鑰
- [ ] 記錄洩漏時間和範圍

### 🔄 清理 Git 歷史

```bash
# 使用 git-filter-branch 移除敏感文件
git filter-branch --tree-filter 'rm -f .env' HEAD

# 強制推送（謹慎操作！）
git push origin --force --all
```

### 🔐 更新密鑰

- [ ] Firebase：禁用舊 API Key，生成新的
- [ ] Ecpay：聯繫客服重置
- [ ] Stripe：禁用舊密鑰，生成新的
- [ ] 更新 Vercel 環境變量

### ✅ 驗證修復

```bash
# 確認敏感文件已從歷史中移除
git log --all --full-history -- .env
# 應該返回空結果
```

## 額外資源

- [OWASP 密鑰管理最佳實踐](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Git 安全最佳實踐](https://git-scm.com/book/zh-tw/v2)
- [Vercel 環境變量](https://vercel.com/docs/projects/environment-variables)

---

**記住**: 永遠不要在代碼中暴露敏感信息！🔐
