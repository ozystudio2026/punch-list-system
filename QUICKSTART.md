# OZY Studio Inspection System - 快速開始指南

## 5 分鐘快速設置

### 步驟 1：克隆專案
```bash
git clone https://github.com/your-username/punch-list-system.git
cd punch-list-system
```

### 步驟 2：安裝依賴
```bash
pnpm install
```

### 步驟 3：配置環境
```bash
cp .env.example .env.local
```

編輯 `.env.local` 並填入你的 Supabase 憑證：
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 步驟 4：啟動開發伺服器
```bash
pnpm dev
```

訪問 `http://localhost:3000`

---

## 核心功能演示

### 1. 登入
- 使用管理員帳號登入
- 郵箱：`ozzy0975@gmail.com`
- 密碼：`Ozy2026!test`

### 2. 建立新專案
1. 點擊「新增專案」
2. 填入專案資訊（案名、客戶名、地址等）
3. 點擊「建立」

### 3. 新增工程項目
1. 進入專案詳情
2. 點擊「工程項目」標籤
3. 點擊「新增項目」
4. 填入項目資訊（類別、描述等）

### 4. 記錄缺失
1. 點擊「缺失記錄」標籤
2. 點擊「新增缺失」
3. 填入缺失資訊
4. 上傳照片（支援多張）
5. 設置期限和優先度
6. 點擊「保存」

### 5. 上傳簽名
1. 進入專案詳情
2. 點擊「簽名」區域
3. 在 iPad 上簽名
4. 點擊「確認」

### 6. 生成報告
1. 進入專案詳情
2. 點擊「生成報告」
3. 選擇報告類型
4. 點擊「下載 PDF」

---

## iPad 優化提示

### 觸控優化
- 所有按鈕大小 ≥ 44×44px（易於觸控）
- 使用大字體（≥16px）
- 避免雙擊縮放

### 離線支援
- PWA 支援離線使用
- 自動同步當網路恢復
- 本地快取照片和簽名

### 性能
- 圖片自動壓縮
- 懶加載大型列表
- 後台同步資料

---

## 常見問題

### Q: 如何重置管理員密碼？
A: 在 Supabase 控制台中進入 Auth 區域，找到使用者並重置密碼。

### Q: 如何備份資料？
A: 使用 Supabase 的備份功能或定期匯出 CSV。

### Q: 如何整合 LINE？
A: 參考 `DEPLOYMENT.md` 中的 LINE 整合部分。

### Q: 如何自訂 PDF 報告？
A: 編輯 `lib/pdf-generator.ts` 中的範本。

---

## 下一步

1. 閱讀 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解完整部署流程
2. 查看 [API 文件](./docs/API.md) 了解後端 API
3. 探索 [設計系統](./docs/DESIGN.md) 了解 UI 元件

---

## 技術棧

- **前端：** Next.js 16, React 19, Tailwind CSS 4
- **後端：** Next.js API Routes, Node.js
- **資料庫：** Supabase (PostgreSQL)
- **認證：** Supabase Auth
- **儲存：** Supabase Storage (S3)
- **實時：** Supabase Realtime
- **部署：** Vercel

---

## 支援

- 📧 郵件：support@ozystudio.com
- 💬 LINE：@ozystudio
- 🐛 報告問題：GitHub Issues

---

祝你使用愉快！ 🎉
