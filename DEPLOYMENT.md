# OZY Studio Inspection System - 部署指南

## 目錄
1. [環境準備](#環境準備)
2. [Supabase 配置](#supabase-配置)
3. [本地開發](#本地開發)
4. [Vercel 部署](#vercel-部署)
5. [整合配置](#整合配置)

---

## 環境準備

### 系統要求
- Node.js 18+ 或 20+
- pnpm 或 npm
- Git

### 安裝依賴
```bash
cd punch-list-system
pnpm install
# 或
npm install
```

---

## Supabase 配置

### 1. 建立 Supabase 專案
1. 訪問 [supabase.com](https://supabase.com)
2. 點擊「New Project」
3. 選擇地區（建議選擇 Singapore 以降低延遲）
4. 設置專案名稱和密碼

### 2. 執行資料庫 Schema
1. 在 Supabase 控制台中進入 SQL Editor
2. 複製 `/database/schema.sql` 的全部內容
3. 貼上並執行 SQL
4. 等待執行完成

### 3. 配置 Storage Buckets
```sql
-- 在 Supabase SQL Editor 中執行以下命令

-- 建立缺失照片 bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('defect-photos', 'defect-photos', true);

-- 建立簽名 bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('signatures', 'signatures', true);

-- 建立報告 bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false);
```

### 4. 配置 RLS 策略（Storage）
在 Supabase 控制台的 Storage 區域：
1. 選擇 `defect-photos` bucket
2. 進入「Policies」標籤
3. 添加 SELECT 策略（允許所有人讀取）
4. 添加 INSERT 策略（允許已認證使用者上傳）
5. 對 `signatures` 和 `reports` 重複上述步驟

### 5. 建立初始使用者
```sql
-- 在 Supabase SQL Editor 中執行

-- 建立公司
INSERT INTO companies (name, slug)
VALUES ('OZY Studio', 'ozy-studio');

-- 獲取公司 ID（複製結果）
SELECT id FROM companies WHERE slug = 'ozy-studio';

-- 建立管理員使用者
INSERT INTO users (company_id, email, name, role, password_hash)
VALUES (
  'YOUR_COMPANY_ID_HERE',
  'ozzy0975@gmail.com',
  'Admin User',
  'admin',
  'hashed_password_here'
);
```

**注意：** 密碼應使用 bcrypt 或類似的安全雜湊演算法。建議使用 Supabase Auth 進行認證。

---

## 本地開發

### 1. 配置環境變數
```bash
cp .env.example .env.local
```

編輯 `.env.local`：
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 啟動開發伺服器
```bash
pnpm dev
```

訪問 `http://localhost:3000`

### 3. 測試基本流程
- [ ] 登入頁面載入
- [ ] 建立新專案
- [ ] 新增工程項目
- [ ] 記錄缺失（含照片）
- [ ] 簽名和報告生成

---

## Vercel 部署

### 1. 準備 GitHub 倉庫
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/punch-list-system.git
git push -u origin main
```

### 2. 連接 Vercel
1. 訪問 [vercel.com](https://vercel.com)
2. 點擊「Import Project」
3. 選擇 GitHub 倉庫
4. 配置環境變數（同本地開發）
5. 點擊「Deploy」

### 3. 部署後配置
- 更新 `NEXT_PUBLIC_APP_URL` 為 Vercel 提供的域名
- 配置自訂域名（可選）

---

## 整合配置

### LINE 集成

#### 1. 建立 LINE Bot
1. 訪問 [LINE Developers Console](https://developers.line.biz/console/)
2. 建立新的 Channel（Messaging API）
3. 複製 Channel Access Token 和 Channel Secret

#### 2. 配置環境變數
```
LINE_CHANNEL_ACCESS_TOKEN=your-token
LINE_CHANNEL_SECRET=your-secret
```

#### 3. 設置 Webhook URL
在 LINE Developers Console 中：
- Webhook URL: `https://your-domain.com/api/webhooks/line`
- 啟用 Webhook

### Notion 集成

#### 1. 建立 Notion Integration
1. 訪問 [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. 建立新的 Internal Integration
3. 複製 Internal Integration Token

#### 2. 建立 Notion Database
1. 在 Notion 中建立新的 Database
2. 複製 Database ID（從 URL 中提取）

#### 3. 配置環境變數
```
NOTION_API_KEY=your-api-key
NOTION_DATABASE_ID=your-database-id
```

#### 4. 分享 Database 給 Integration
在 Notion Database 中：
- 點擊「Share」
- 選擇你的 Integration
- 點擊「Invite」

---

## 故障排除

### 問題：Supabase 連接失敗
**解決方案：**
1. 檢查 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. 確認 Supabase 專案已啟用
3. 檢查 CORS 設置

### 問題：照片上傳失敗
**解決方案：**
1. 確認 Storage Buckets 已建立
2. 檢查 RLS 策略
3. 驗證檔案大小限制（預設 50MB）

### 問題：簽名無法保存
**解決方案：**
1. 檢查瀏覽器控制台錯誤
2. 驗證 Canvas 支援
3. 確認 Storage 權限

---

## 安全建議

1. **環境變數**
   - 不要在版本控制中提交 `.env.local`
   - 使用 `.env.example` 作為範本

2. **資料庫**
   - 定期備份 Supabase 資料
   - 啟用 RLS 策略
   - 使用強密碼

3. **認證**
   - 啟用 Supabase Auth 的 MFA
   - 定期更新密碼
   - 使用 HTTPS

4. **API 密鑰**
   - 定期輪換 LINE 和 Notion API 密鑰
   - 限制 API 密鑰的權限
   - 監控 API 使用情況

---

## 效能優化

1. **圖片優化**
   - 使用 WebP 格式
   - 壓縮圖片大小
   - 實現圖片懶加載

2. **快取策略**
   - 啟用 PWA 離線支援
   - 使用 Service Worker 快取
   - 實現增量同步

3. **資料庫查詢**
   - 使用索引優化查詢
   - 實現分頁
   - 避免 N+1 查詢

---

## 監控和日誌

### Vercel 監控
- 訪問 Vercel 控制台查看部署日誌
- 監控效能指標
- 設置告警

### Supabase 監控
- 檢查資料庫日誌
- 監控 API 使用情況
- 查看 Storage 統計

---

## 聯繫支援

如有問題，請聯繫：
- 開發團隊：dev@ozystudio.com
- 技術支援：support@ozystudio.com

---

最後更新：2026-05-19
