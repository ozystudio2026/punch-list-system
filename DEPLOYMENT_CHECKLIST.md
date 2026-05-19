# OZY Studio Inspection System - 部署前檢查清單

## 📋 部署前檢查

### 開發環境準備
- [ ] Node.js 18+ 已安裝
- [ ] pnpm 已安裝
- [ ] Git 已配置
- [ ] 所有依賴已安裝 (`pnpm install`)
- [ ] 本地開發伺服器可正常運行 (`pnpm dev`)

### 程式碼品質
- [ ] TypeScript 編譯無錯誤 (`pnpm tsc --noEmit`)
- [ ] ESLint 檢查通過 (`pnpm lint`)
- [ ] 所有單元測試通過 (`pnpm test`)
- [ ] 程式碼覆蓋率 ≥ 80%
- [ ] 沒有 console.log 或 debugger 語句
- [ ] 沒有硬編碼的敏感資訊

### 環境配置
- [ ] `.env.local` 已配置
- [ ] Supabase URL 正確
- [ ] Supabase Anon Key 正確
- [ ] 所有必需的環境變數已設置
- [ ] 沒有提交 `.env.local` 到版本控制

### 資料庫準備
- [ ] Supabase 專案已建立
- [ ] 資料庫 schema 已執行 (`database/schema.sql`)
- [ ] Storage Buckets 已建立
  - [ ] `defect-photos` (公開)
  - [ ] `signatures` (公開)
  - [ ] `reports` (私密)
- [ ] RLS 策略已配置
- [ ] 初始資料已匯入
- [ ] 資料庫備份已完成

### 功能測試（本地）
- [ ] 登入流程正常
- [ ] 建立專案成功
- [ ] 新增工程項目成功
- [ ] 記錄缺失成功
- [ ] 上傳照片成功
- [ ] 簽名功能正常
- [ ] 生成 PDF 報告成功
- [ ] 登出流程正常

### iPad 測試
- [ ] 在 iPad Safari 上測試
- [ ] 觸控操作流暢
- [ ] 按鈕大小適當（≥44×44px）
- [ ] 字體大小清晰（≥16px）
- [ ] 沒有橫向滾動
- [ ] 簽名功能在 iPad 上正常

### 行動設備測試
- [ ] 在 iPhone 上測試
- [ ] 在 Android 上測試
- [ ] 響應式設計正常
- [ ] 觸控事件正常
- [ ] 照片上傳正常

### 瀏覽器相容性
- [ ] Chrome 最新版本
- [ ] Safari 最新版本
- [ ] Firefox 最新版本
- [ ] Edge 最新版本

### 效能檢查
- [ ] 首頁載入時間 < 2s
- [ ] API 回應時間 < 200ms
- [ ] 圖片已優化
- [ ] 沒有未使用的依賴
- [ ] 程式碼分割已配置

### 安全檢查
- [ ] 沒有 SQL 注入漏洞
- [ ] 沒有 XSS 漏洞
- [ ] CORS 已正確配置
- [ ] HTTPS 已啟用
- [ ] 敏感資訊已加密
- [ ] 稽核日誌已配置

### 文件完整性
- [ ] README.md 已更新
- [ ] QUICKSTART.md 已完成
- [ ] DEPLOYMENT.md 已完成
- [ ] API 文件已完成
- [ ] 設計文件已完成
- [ ] 環境變數文件已完成

### Git 準備
- [ ] 所有變更已提交
- [ ] 沒有未追蹤的檔案
- [ ] 分支已推送到遠端
- [ ] 沒有合併衝突

---

## 🚀 Vercel 部署步驟

### 步驟 1：準備 GitHub 倉庫
```bash
# 初始化 Git（如果尚未初始化）
git init

# 添加所有檔案
git add .

# 提交
git commit -m "Initial commit: OZY Studio Inspection System"

# 建立 main 分支
git branch -M main

# 添加遠端
git remote add origin https://github.com/YOUR_USERNAME/punch-list-system.git

# 推送
git push -u origin main
```

### 步驟 2：在 Vercel 中部署
1. 訪問 [vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登入
3. 點擊「Import Project」
4. 選擇 `punch-list-system` 倉庫
5. 配置專案設置：
   - **Project Name:** punch-list-system
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
6. 配置環境變數：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`（部署後的 URL）
7. 點擊「Deploy」

### 步驟 3：驗證部署
- [ ] 部署完成（Vercel 儀表板顯示成功）
- [ ] 訪問部署的 URL
- [ ] 功能測試通過
- [ ] 沒有錯誤日誌

---

## 🔗 整合配置

### LINE 整合
- [ ] LINE Channel 已建立
- [ ] Channel Access Token 已複製
- [ ] Channel Secret 已複製
- [ ] Webhook URL 已設置
- [ ] 環境變數已配置

### Notion 整合
- [ ] Notion Integration 已建立
- [ ] API Key 已複製
- [ ] Database 已建立
- [ ] Database ID 已複製
- [ ] 環境變數已配置

---

## 📊 部署後驗證

### 功能驗證
- [ ] 登入功能正常
- [ ] 專案管理正常
- [ ] 缺失記錄正常
- [ ] 照片上傳正常
- [ ] 簽名功能正常
- [ ] PDF 報告生成正常
- [ ] 實時同步正常

### 效能驗證
- [ ] 首頁載入時間 < 2s
- [ ] API 回應時間 < 200ms
- [ ] 資料庫查詢效能良好
- [ ] 沒有 N+1 查詢

### 安全驗證
- [ ] HTTPS 已啟用
- [ ] 安全標頭已配置
- [ ] 認證流程正常
- [ ] 授權檢查正常
- [ ] 稽核日誌記錄正常

### 監控設置
- [ ] Vercel 監控已啟用
- [ ] 錯誤追蹤已配置
- [ ] 效能監控已啟用
- [ ] 告警已設置

---

## 🐛 常見問題排查

### 部署失敗
1. 檢查 Vercel 部署日誌
2. 驗證環境變數
3. 檢查 GitHub 倉庫連接
4. 確認所有依賴已安裝

### 功能不正常
1. 檢查瀏覽器控制台錯誤
2. 檢查 Vercel 函數日誌
3. 驗證 Supabase 連接
4. 檢查 RLS 策略

### 效能問題
1. 檢查 Vercel 分析
2. 優化圖片大小
3. 檢查資料庫查詢
4. 啟用快取

---

## 📞 部署支援

遇到問題？

1. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md)
2. 檢查 [Vercel 文件](https://vercel.com/docs)
3. 檢查 [Supabase 文件](https://supabase.com/docs)
4. 聯繫技術支援：support@ozystudio.com

---

## ✅ 最終確認

在部署到生產環境前，請確認：

- [ ] 所有檢查項目已完成
- [ ] 所有測試已通過
- [ ] 文件已更新
- [ ] 團隊已知會
- [ ] 備份已完成
- [ ] 回滾計畫已準備

---

**部署日期：** _______________  
**部署人員：** _______________  
**版本號：** 0.1.0  
**狀態：** 🟢 準備就緒

