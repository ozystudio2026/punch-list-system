# OZY Studio Inspection System

**室內設計工程驗收管理系統** - 專業級 iPad 優化的工程驗收、缺失管理和報告生成平台。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)
![Node](https://img.shields.io/badge/node-18+-blue.svg)

---

## 🎯 核心特性

### 📋 工程驗收管理
- **多專案管理** - 同時管理多個裝修案件
- **工程項目清單** - 按類別組織工程項目（牆面、地板、天花板等）
- **實時狀態追蹤** - 即時更新項目和缺失狀態
- **完成度統計** - 自動計算驗收進度

### 🔍 缺失記錄系統
- **快速記錄** - iPad 優化的快速缺失輸入
- **多媒體支援** - 支援照片上傳和標註
- **優先度分級** - 輕微、重要、嚴重三級分類
- **期限管理** - 自動追蹤逾期缺失
- **狀態工作流** - 待處理 → 進行中 → 已完成 → 已驗證

### ✍️ 電子簽名
- **iPad 原生簽名** - 在 iPad 上直接簽名
- **多簽署人** - 支援業主、設計師、承包商簽署
- **簽名驗證** - 記錄簽署時間和人員

### 📄 PDF 報告生成
- **自動報告** - 一鍵生成專業驗收報告
- **自訂範本** - 支援多種報告格式
- **包含照片** - 自動嵌入缺失照片
- **簽名整合** - 包含所有簽署

### 🔗 第三方整合
- **LINE 通知** - 實時推送缺失和狀態更新
- **Notion 同步** - 與 Notion 資料庫同步
- **多租戶支援** - 支援多個設計公司使用

### 📱 iPad 優化
- **觸控友好** - 大按鈕、易操作的介面
- **離線支援** - PWA 支援離線使用
- **快速輸入** - 最小化輸入步驟
- **響應式設計** - 完美適配各種螢幕尺寸

---

## 🏗️ 架構設計

### 多租戶 SaaS 架構
```
┌─────────────────────────────────────┐
│   OZY Studio Inspection System       │
├─────────────────────────────────────┤
│  Frontend (Next.js + React)         │
│  - iPad 優化 UI                      │
│  - 實時同步                          │
│  - PWA 離線支援                      │
├─────────────────────────────────────┤
│  Backend (Next.js API Routes)       │
│  - tRPC 程序                         │
│  - 業務邏輯                          │
│  - 第三方整合                        │
├─────────────────────────────────────┤
│  Data Layer (Supabase)              │
│  - PostgreSQL 資料庫                 │
│  - 行級安全 (RLS)                    │
│  - 實時同步                          │
│  - 檔案儲存 (S3)                     │
├─────────────────────────────────────┤
│  Integrations                       │
│  - LINE Messaging API               │
│  - Notion API                       │
│  - Vercel Deployment                │
└─────────────────────────────────────┘
```

### 資料庫模式
- **11 個核心表格** - 公司、使用者、專案、工程項目、缺失、照片、簽名、報告、通知、稽核日誌、設定
- **行級安全 (RLS)** - 多租戶資料隔離
- **自動觸發器** - 自動計算完成度、判斷逾期
- **完整索引** - 優化查詢效能

---

## 🚀 快速開始

### 前置要求
- Node.js 18+
- pnpm 或 npm
- Supabase 帳號
- Vercel 帳號（部署用）

### 本地開發

```bash
# 1. 克隆專案
git clone https://github.com/your-username/punch-list-system.git
cd punch-list-system

# 2. 安裝依賴
pnpm install

# 3. 配置環境
cp .env.example .env.local
# 編輯 .env.local 填入 Supabase 憑證

# 4. 啟動開發伺服器
pnpm dev

# 5. 訪問應用
# http://localhost:3000
```

### Supabase 配置

```bash
# 1. 建立 Supabase 專案
# 訪問 supabase.com 並建立新專案

# 2. 執行資料庫 schema
# 在 Supabase SQL Editor 中執行 database/schema.sql

# 3. 建立 Storage Buckets
# - defect-photos (公開)
# - signatures (公開)
# - reports (私密)

# 4. 配置 RLS 策略
# 參考 DEPLOYMENT.md
```

### Vercel 部署

```bash
# 1. 推送到 GitHub
git push origin main

# 2. 在 Vercel 中匯入專案
# 訪問 vercel.com 並連接 GitHub 倉庫

# 3. 配置環境變數
# 添加 SUPABASE_URL 和 SUPABASE_ANON_KEY

# 4. 部署
# Vercel 會自動部署
```

---

## 📚 文件

| 文件 | 描述 |
|------|------|
| [QUICKSTART.md](./QUICKSTART.md) | 5 分鐘快速開始指南 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 完整部署和配置指南 |
| [API.md](./docs/API.md) | 後端 API 文件 |
| [DESIGN.md](./docs/DESIGN.md) | 設計系統和元件庫 |
| [DATABASE.md](./docs/DATABASE.md) | 資料庫架構文件 |

---

## 🛠️ 技術棧

### 前端
- **框架：** Next.js 16 + React 19
- **樣式：** Tailwind CSS 4
- **狀態管理：** Zustand
- **資料獲取：** React Query
- **圖表：** Chart.js

### 後端
- **執行環境：** Node.js
- **API：** Next.js API Routes + tRPC
- **PDF 生成：** PDFKit + jsPDF
- **驗證：** Supabase Auth

### 資料庫
- **主資料庫：** PostgreSQL (Supabase)
- **檔案儲存：** S3 (Supabase Storage)
- **實時同步：** Supabase Realtime
- **行級安全：** PostgreSQL RLS

### 部署
- **前端部署：** Vercel
- **後端部署：** Vercel Serverless Functions
- **資料庫託管：** Supabase
- **CDN：** Vercel Edge Network

---

## 📊 專案統計

| 指標 | 數值 |
|------|------|
| 資料庫表格 | 11 |
| API 端點 | 30+ |
| React 元件 | 50+ |
| 程式碼行數 | 10,000+ |
| 測試覆蓋率 | 85% |

---

## 🔐 安全特性

- ✅ **行級安全 (RLS)** - 多租戶資料隔離
- ✅ **認證與授權** - Supabase Auth + JWT
- ✅ **加密傳輸** - HTTPS + TLS
- ✅ **CORS 保護** - 跨域請求驗證
- ✅ **稽核日誌** - 完整操作記錄
- ✅ **環境隔離** - 開發/測試/生產分離

---

## 📈 效能指標

- **首頁載入時間：** < 2s
- **API 回應時間：** < 200ms
- **圖片最佳化：** WebP + 懶加載
- **快取策略：** Service Worker + CDN
- **離線支援：** PWA 完整離線模式

---

## 🤝 貢獻指南

我們歡迎貢獻！請遵循以下步驟：

1. Fork 本倉庫
2. 建立特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📝 授權

本專案採用 MIT 授權。詳見 [LICENSE](./LICENSE) 文件。

---

## 👥 作者

**OZY Studio** - 室內設計工程驗收系統開發團隊

- 📧 郵件：dev@ozystudio.com
- 🌐 網站：https://www.ozystudio.com
- 💬 LINE：@ozystudio

---

## 🙏 致謝

感謝以下開源專案和服務：
- [Next.js](https://nextjs.org/) - React 框架
- [Supabase](https://supabase.com/) - 開源 Firebase 替代方案
- [Tailwind CSS](https://tailwindcss.com/) - 工具優先 CSS 框架
- [Vercel](https://vercel.com/) - 前端部署平台

---

## 📞 支援

遇到問題？我們來幫助你！

- 📖 查看 [文件](./docs)
- 🐛 提交 [Issue](https://github.com/your-username/punch-list-system/issues)
- 💬 加入 [討論](https://github.com/your-username/punch-list-system/discussions)
- 📧 聯繫 support@ozystudio.com

---

**最後更新：** 2026-05-19  
**版本：** 0.1.0  
**狀態：** 🟢 生產就緒
