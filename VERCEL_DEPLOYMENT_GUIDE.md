# Vercel 部署完整指南

## 🚀 在 Vercel 中部署應用

### 步驟 1：訪問 Vercel 並匯入專案

1. 訪問 [vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登入（ozystudio2026）
3. 點擊「Add New」→「Project」
4. 選擇「Import Git Repository」
5. 在搜索框中輸入 `punch-list-system`
6. 選擇 `ozystudio2026/punch-list-system`
7. 點擊「Import」

### 步驟 2：配置專案設置

在「Configure Project」頁面中：

**Project Name:** punch-list-system  
**Framework Preset:** Next.js  
**Root Directory:** ./  

點擊「Continue」

### 步驟 3：配置環境變數

在「Environment Variables」部分，添加以下變數：

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
NEXT_PUBLIC_APP_URL = https://punch-list-system.vercel.app
```

**重要：** 你需要先完成 Supabase 設置才能獲得這些值。

### 步驟 4：部署

1. 點擊「Deploy」按鈕
2. 等待部署完成（通常 3-5 分鐘）
3. 看到「Congratulations!」即表示部署成功

### 步驟 5：訪問應用

部署完成後，你會看到應用 URL：
- 自動分配的 URL：`https://punch-list-system.vercel.app`
- 或你自訂的域名

---

## ⚙️ Supabase 設置（必須在部署前完成）

### 步驟 1：建立 Supabase 專案

1. 訪問 [supabase.com](https://supabase.com)
2. 點擊「New Project」
3. 填入以下資訊：
   - **Project Name:** punch-list-system
   - **Database Password:** 設置強密碼（保存此密碼）
   - **Region:** Singapore（推薦，降低延遲）
4. 點擊「Create new project」
5. 等待專案建立完成（通常 2-3 分鐘）

### 步驟 2：執行資料庫 Schema

1. 進入 Supabase 控制台
2. 進入左側菜單的「SQL Editor」
3. 點擊「New Query」
4. 複製以下內容並貼上：

```sql
-- 複製 punch-list-system/database/schema.sql 的全部內容
```

5. 點擊「Run」執行
6. 等待執行完成

### 步驟 3：建立 Storage Buckets

在 SQL Editor 中執行以下命令：

```sql
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

### 步驟 4：複製 Supabase 憑證

1. 進入「Settings」→「API」
2. 複製以下資訊：
   - **Project URL**：`https://xxx.supabase.co`
   - **anon public**：`eyJhbGc...`

這些值將用於 Vercel 環境變數。

### 步驟 5：建立初始管理員帳號

在 SQL Editor 中執行：

```sql
-- 建立公司
INSERT INTO companies (name, slug)
VALUES ('OZY Studio', 'ozy-studio');

-- 建立管理員使用者
INSERT INTO users (company_id, email, name, role)
VALUES (
  (SELECT id FROM companies WHERE slug = 'ozy-studio'),
  'ozzy0975@gmail.com',
  'Admin User',
  'admin'
);
```

---

## 🔗 整合配置（可選）

### LINE 整合

1. 訪問 [LINE Developers Console](https://developers.line.biz/console/)
2. 建立新的 Messaging API Channel
3. 複製 **Channel Access Token** 和 **Channel Secret**
4. 在 Vercel 環境變數中添加：
   ```
   LINE_CHANNEL_ACCESS_TOKEN = your-token
   LINE_CHANNEL_SECRET = your-secret
   ```
5. 設置 Webhook URL：`https://punch-list-system.vercel.app/api/webhooks/line`

### Notion 整合

1. 訪問 [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. 建立新的 Internal Integration
3. 複製 **Internal Integration Token**
4. 在 Notion 中建立 Database
5. 複製 **Database ID**（從 URL 中提取）
6. 在 Vercel 環境變數中添加：
   ```
   NOTION_API_KEY = your-api-key
   NOTION_DATABASE_ID = your-database-id
   ```

---

## 📊 部署後驗證

### 檢查應用可訪問性

1. 訪問 `https://punch-list-system.vercel.app`
2. 確認應用載入成功
3. 檢查是否有錯誤訊息

### 測試基本功能

- [ ] 登入頁面載入
- [ ] 使用 `ozzy0975@gmail.com` / `Ozy2026!test` 登入
- [ ] 查看 Dashboard
- [ ] 建立新專案
- [ ] 新增工程項目
- [ ] 記錄缺失
- [ ] 上傳照片
- [ ] 生成 PDF 報告

### 檢查日誌

1. 在 Vercel 儀表板中進入專案
2. 進入「Deployments」
3. 選擇最新部署
4. 進入「Logs」查看是否有錯誤

---

## 🔐 安全建議

1. **環境變數**
   - 不要在代碼中硬編碼敏感資訊
   - 使用 Vercel 環境變數管理

2. **Supabase 安全**
   - 啟用 RLS（行級安全）
   - 定期更新密碼
   - 啟用 MFA（多因素認證）

3. **API 密鑰**
   - 定期輪換 LINE 和 Notion API 密鑰
   - 限制 API 密鑰的權限

---

## 🐛 故障排除

### 部署失敗

**症狀：** Vercel 部署失敗

**解決方案：**
1. 檢查 Vercel 部署日誌
2. 驗證 package.json 依賴
3. 確認 next.config.js 配置
4. 檢查 TypeScript 編譯錯誤

### 應用載入失敗

**症狀：** 訪問應用時顯示 404 或 500 錯誤

**解決方案：**
1. 檢查瀏覽器控制台錯誤
2. 驗證 Supabase 連接
3. 檢查環境變數是否正確
4. 清除瀏覽器快取

### 功能不正常

**症狀：** 登入、上傳等功能不工作

**解決方案：**
1. 檢查 Vercel 函數日誌
2. 驗證 Supabase 資料庫連接
3. 檢查 RLS 策略
4. 驗證 Storage Buckets 權限

---

## 📈 監控和日誌

### Vercel 監控

1. 進入 Vercel 儀表板
2. 進入「Analytics」查看流量和效能
3. 進入「Deployments」查看部署歷史
4. 進入「Settings」配置告警

### Supabase 監控

1. 進入 Supabase 控制台
2. 進入「Logs」查看資料庫日誌
3. 進入「Monitoring」查看效能指標
4. 進入「Backups」查看備份狀態

---

## ✅ 部署檢查清單

在完成部署後，請確認：

- [ ] GitHub 倉庫已推送
- [ ] Vercel 專案已建立
- [ ] 環境變數已配置
- [ ] Supabase 專案已建立
- [ ] 資料庫 Schema 已執行
- [ ] Storage Buckets 已建立
- [ ] 應用可訪問
- [ ] 功能測試通過
- [ ] 沒有錯誤日誌
- [ ] 監控已配置

---

## 🎉 部署完成

恭喜！你已經成功部署了 OZY Studio Inspection System。

### 下一步

1. 邀請團隊成員使用
2. 建立初始專案
3. 配置 LINE 和 Notion 整合
4. 監控應用效能
5. 收集使用者反饋

### 支援

- 📖 查看 [DEPLOYMENT.md](./DEPLOYMENT.md)
- 📧 聯繫 support@ozystudio.com
- 💬 加入 LINE 官方帳號 @ozystudio

---

**部署完成日期：** _______________  
**應用 URL：** _______________  
**Supabase Project ID：** _______________
