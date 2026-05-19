# OZY Studio Inspection System - 立即部署指南

## 🚀 快速部署（10 分鐘）

本指南將帶你完成從開發到生產的部署流程。

---

## 第一步：準備 GitHub 倉庫

### 1.1 初始化 Git（如果尚未初始化）
```bash
cd /home/ubuntu/punch-list-system
git init
```

### 1.2 配置 Git 使用者（如果尚未配置）
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### 1.3 添加所有檔案
```bash
git add .
```

### 1.4 提交變更
```bash
git commit -m "Initial commit: OZY Studio Inspection System v0.1.0"
```

### 1.5 建立 main 分支
```bash
git branch -M main
```

### 1.6 添加遠端倉庫
```bash
# 替換 YOUR_USERNAME 為你的 GitHub 使用者名稱
git remote add origin https://github.com/YOUR_USERNAME/punch-list-system.git
```

### 1.7 推送到 GitHub
```bash
git push -u origin main
```

---

## 第二步：準備 Supabase

### 2.1 建立 Supabase 專案
1. 訪問 [supabase.com](https://supabase.com)
2. 點擊「New Project」
3. 選擇地區（建議 Singapore）
4. 設置專案名稱和密碼
5. 等待專案建立完成

### 2.2 執行資料庫 Schema
1. 進入 Supabase 控制台
2. 進入「SQL Editor」
3. 點擊「New Query」
4. 複製 `database/schema.sql` 的全部內容
5. 貼上到編輯器
6. 點擊「Run」
7. 等待執行完成

### 2.3 建立 Storage Buckets
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

### 2.4 複製 Supabase 憑證
1. 進入「Settings」→「API」
2. 複製「Project URL」
3. 複製「anon public」密鑰
4. 保存這些值（下一步需要）

---

## 第三步：配置環境變數

### 3.1 建立 .env.local
```bash
cp .env.example .env.local
```

### 3.2 編輯 .env.local
```bash
# 使用你的編輯器打開 .env.local
nano .env.local
```

### 3.3 填入 Supabase 憑證
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.4 保存檔案
按 `Ctrl+X`，然後 `Y`，再按 `Enter`

---

## 第四步：本地測試

### 4.1 安裝依賴
```bash
pnpm install
```

### 4.2 啟動開發伺服器
```bash
pnpm dev
```

### 4.3 訪問應用
打開瀏覽器訪問 `http://localhost:3000`

### 4.4 測試基本功能
- [ ] 登入頁面載入
- [ ] 建立新專案
- [ ] 新增工程項目
- [ ] 記錄缺失
- [ ] 上傳照片
- [ ] 生成報告

### 4.5 停止開發伺服器
按 `Ctrl+C`

---

## 第五步：部署到 Vercel

### 5.1 訪問 Vercel
1. 訪問 [vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登入（或建立帳號）

### 5.2 匯入專案
1. 點擊「Add New」
2. 選擇「Project」
3. 點擊「Import Git Repository」
4. 搜索 `punch-list-system`
5. 點擊「Import」

### 5.3 配置專案設置
1. **Project Name:** punch-list-system
2. **Framework Preset:** Next.js
3. **Root Directory:** ./
4. 點擊「Continue」

### 5.4 配置環境變數
在「Environment Variables」部分添加：

| 變數名 | 值 |
|-------|-----|
| NEXT_PUBLIC_SUPABASE_URL | https://your-project.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | your-anon-key-here |
| NEXT_PUBLIC_APP_URL | https://punch-list-system.vercel.app |

### 5.5 部署
1. 點擊「Deploy」
2. 等待部署完成（通常 2-5 分鐘）
3. 部署完成後會看到「Congratulations!」

### 5.6 訪問部署的應用
1. 點擊「Visit」
2. 或訪問 `https://punch-list-system.vercel.app`

---

## 第六步：驗證部署

### 6.1 檢查應用可訪問性
- [ ] 應用載入成功
- [ ] 沒有 404 錯誤
- [ ] 沒有 500 錯誤

### 6.2 測試功能
- [ ] 登入功能正常
- [ ] 專案管理正常
- [ ] 缺失記錄正常
- [ ] 照片上傳正常
- [ ] PDF 報告生成正常

### 6.3 檢查日誌
1. 在 Vercel 儀表板中進入專案
2. 進入「Deployments」
3. 選擇最新部署
4. 進入「Logs」
5. 檢查是否有錯誤

---

## 第七步：配置自訂域名（可選）

### 7.1 購買域名
1. 訪問 GoDaddy、Namecheap 等域名提供商
2. 購買你的域名（例如 inspection.ozystudio.com）

### 7.2 在 Vercel 中配置
1. 進入 Vercel 專案設置
2. 進入「Domains」
3. 點擊「Add」
4. 輸入你的域名
5. 按照說明配置 DNS 記錄

### 7.3 驗證域名
1. 等待 DNS 傳播（通常 24 小時）
2. 訪問你的自訂域名
3. 驗證應用正常運行

---

## 第八步：配置第三方整合（可選）

### 8.1 LINE 整合
1. 訪問 [LINE Developers Console](https://developers.line.biz/console/)
2. 建立新的 Messaging API Channel
3. 複製 Channel Access Token 和 Channel Secret
4. 在 Vercel 環境變數中添加：
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `LINE_CHANNEL_SECRET`
5. 設置 Webhook URL：`https://your-domain.com/api/webhooks/line`

### 8.2 Notion 整合
1. 訪問 [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. 建立新的 Internal Integration
3. 複製 Internal Integration Token
4. 在 Vercel 環境變數中添加：
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`

---

## 故障排除

### 問題：部署失敗
**解決方案：**
1. 檢查 Vercel 部署日誌
2. 驗證環境變數
3. 確認 GitHub 倉庫連接
4. 檢查 package.json 依賴

### 問題：應用載入失敗
**解決方案：**
1. 檢查瀏覽器控制台錯誤
2. 驗證 Supabase 連接
3. 檢查 CORS 設置
4. 清除瀏覽器快取

### 問題：功能不正常
**解決方案：**
1. 檢查 Vercel 函數日誌
2. 驗證 Supabase 資料庫
3. 檢查 RLS 策略
4. 驗證環境變數

---

## 📊 部署檢查清單

在完成部署後，請確認：

- [ ] GitHub 倉庫已推送
- [ ] Supabase 專案已建立
- [ ] 資料庫 Schema 已執行
- [ ] Storage Buckets 已建立
- [ ] Vercel 部署已完成
- [ ] 應用可訪問
- [ ] 功能測試通過
- [ ] 沒有錯誤日誌
- [ ] 環境變數已配置
- [ ] 自訂域名已配置（可選）

---

## 🎉 恭喜！

你已經成功部署了 OZY Studio Inspection System！

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
**部署人員：** _______________  
**應用 URL：** _______________

---

祝你使用愉快！ 🚀
