# OZY Studio Inspection System - 測試計畫

## 測試概述

本文件定義了 OZY Studio Inspection System 的完整測試策略，包括單元測試、整合測試、端到端測試和效能測試。

---

## 1. 單元測試

### 測試框架
- **框架：** Jest + React Testing Library
- **覆蓋率目標：** ≥ 80%

### 測試範圍

#### 工具函數測試
- 日期計算函數（判斷逾期）
- 狀態轉換邏輯
- 資料驗證函數
- 格式化函數

#### React 元件測試
- 登入表單
- 專案卡片
- 缺失列表
- 簽名畫布
- 照片上傳

#### API 路由測試
- 認證端點
- 專案 CRUD 操作
- 缺失 CRUD 操作
- 檔案上傳
- PDF 生成

### 測試命令
```bash
# 執行所有測試
pnpm test

# 監視模式
pnpm test --watch

# 覆蓋率報告
pnpm test --coverage
```

---

## 2. 整合測試

### 資料庫整合
- Supabase 連接
- 認證流程
- 資料查詢
- 事務處理

### API 整合
- 端點可達性
- 請求/回應格式
- 錯誤處理
- 速率限制

### 第三方服務
- LINE 通知
- Notion 同步
- PDF 生成
- 檔案儲存

### 測試場景

#### 場景 1：完整的缺失記錄流程
1. 登入系統
2. 建立新專案
3. 新增工程項目
4. 記錄缺失
5. 上傳照片
6. 設置期限
7. 保存記錄
8. 驗證資料庫

#### 場景 2：簽名和報告生成
1. 進入專案詳情
2. 簽名（業主）
3. 簽名（設計師）
4. 生成 PDF 報告
5. 驗證 PDF 內容
6. 下載報告

#### 場景 3：實時同步
1. 在設備 A 上更新缺失狀態
2. 驗證設備 B 上的實時更新
3. 驗證 LINE 通知
4. 驗證 Notion 同步

---

## 3. 端到端測試

### 測試工具
- **框架：** Cypress 或 Playwright
- **環境：** 測試環境 Supabase 專案

### 測試場景

#### 用戶旅程 1：新使用者入門
```
1. 訪問登入頁面
2. 點擊「建立帳號」
3. 填入註冊表單
4. 驗證郵件
5. 登入系統
6. 查看 Dashboard
7. 建立第一個專案
```

#### 用戶旅程 2：完整的驗收流程
```
1. 登入系統
2. 選擇專案
3. 查看工程項目清單
4. 記錄第一個缺失
5. 上傳照片
6. 設置期限
7. 指派給承包商
8. 等待承包商更新
9. 驗證完成
10. 生成報告
11. 簽名
12. 下載 PDF
```

#### 用戶旅程 3：iPad 特定流程
```
1. 在 iPad Safari 上訪問應用
2. 添加到主畫面（PWA）
3. 啟動應用
4. 離線操作（記錄缺失）
5. 恢復網路連接
6. 驗證同步
7. 簽名功能
8. 照片上傳
```

### 測試命令
```bash
# 執行 E2E 測試
pnpm test:e2e

# 監視模式
pnpm test:e2e --watch

# 特定測試
pnpm test:e2e --spec "cypress/e2e/defect-flow.cy.ts"
```

---

## 4. 效能測試

### 效能指標

| 指標 | 目標 | 測量方法 |
|------|------|--------|
| 首頁載入時間 | < 2s | Lighthouse |
| API 回應時間 | < 200ms | Chrome DevTools |
| 互動延遲 | < 100ms | Web Vitals |
| 記憶體使用 | < 100MB | Chrome DevTools |
| 電池消耗 | 低 | 實際測試 |

### 效能測試場景

#### 場景 1：大型專案載入
- 專案包含 1000+ 缺失記錄
- 測量列表載入時間
- 測量滾動效能

#### 場景 2：照片上傳
- 上傳 10MB 圖片
- 測量上傳時間
- 測量進度更新

#### 場景 3：PDF 生成
- 包含 100+ 照片的報告
- 測量生成時間
- 測量檔案大小

### 測試命令
```bash
# Lighthouse 審計
pnpm lighthouse

# 效能分析
pnpm test:performance
```

---

## 5. 安全測試

### 安全檢查清單

#### 認證安全
- [ ] 密碼加密存儲
- [ ] JWT 令牌有效期
- [ ] 會話超時
- [ ] CSRF 保護

#### 資料安全
- [ ] SQL 注入防護
- [ ] XSS 防護
- [ ] CORS 配置
- [ ] 敏感資訊加密

#### API 安全
- [ ] 速率限制
- [ ] 輸入驗證
- [ ] 輸出編碼
- [ ] 錯誤訊息隱藏

#### 檔案上傳安全
- [ ] 檔案類型驗證
- [ ] 檔案大小限制
- [ ] 病毒掃描
- [ ] 隔離儲存

### 安全測試工具
- OWASP ZAP
- Burp Suite
- npm audit

---

## 6. 相容性測試

### 瀏覽器相容性

| 瀏覽器 | 最小版本 | 測試狀態 |
|-------|---------|--------|
| Chrome | 90+ | ✅ |
| Safari | 14+ | ✅ |
| Firefox | 88+ | ✅ |
| Edge | 90+ | ✅ |
| Chrome Mobile | 90+ | ✅ |
| Safari iOS | 14+ | ✅ |

### 設備相容性

| 設備 | 螢幕尺寸 | 測試狀態 |
|------|--------|--------|
| iPad Pro | 12.9" | ✅ |
| iPad Air | 10.9" | ✅ |
| iPad | 10.2" | ✅ |
| iPad Mini | 7.9" | ✅ |
| iPhone 14 Pro | 6.1" | ✅ |
| iPhone 14 Plus | 6.7" | ✅ |
| Android 平板 | 10" | ✅ |
| Android 手機 | 6.1" | ✅ |

---

## 7. 可訪問性測試

### 可訪問性標準
- WCAG 2.1 Level AA
- 鍵盤導航
- 螢幕閱讀器支援

### 測試工具
- axe DevTools
- WAVE
- Lighthouse Accessibility

### 測試場景
- 鍵盤導航整個應用
- 使用螢幕閱讀器（NVDA/JAWS）
- 色彩對比檢查
- 焦點管理

---

## 8. 測試環境

### 開發環境
- 本地 Supabase 模擬器（可選）
- 本地開發伺服器
- 本地資料庫

### 測試環境
- 測試 Supabase 專案
- 測試伺服器
- 測試資料庫

### 生產環境
- 生產 Supabase 專案
- 生產伺服器
- 生產資料庫

---

## 9. 測試資料

### 初始化測試資料
```sql
-- 建立測試公司
INSERT INTO companies (name, slug) VALUES ('Test Company', 'test-company');

-- 建立測試使用者
INSERT INTO users (company_id, email, name, role)
VALUES (
  (SELECT id FROM companies WHERE slug = 'test-company'),
  'test@example.com',
  'Test User',
  'admin'
);

-- 建立測試專案
INSERT INTO projects (company_id, name, client_name, created_by)
VALUES (
  (SELECT id FROM companies WHERE slug = 'test-company'),
  'Test Project',
  'Test Client',
  (SELECT id FROM users WHERE email = 'test@example.com')
);
```

### 清理測試資料
```bash
# 刪除測試資料
pnpm test:cleanup
```

---

## 10. 測試時間表

### 開發階段
- 單元測試：持續進行
- 整合測試：每週
- 效能測試：每週

### 預發布階段
- 完整 E2E 測試：每日
- 安全測試：每週
- 相容性測試：最終發布前

### 發布後
- 監控和日誌：持續
- 使用者反饋：持續
- 熱修復測試：按需

---

## 11. 測試報告

### 每日報告
- 單元測試覆蓋率
- 失敗的測試數
- 新發現的問題

### 每週報告
- 測試執行摘要
- 缺陷趨勢
- 效能指標

### 發布報告
- 完整測試結果
- 已知問題
- 建議

---

## 12. 持續整合

### CI/CD 流程
```
Push to GitHub
    ↓
Run Linting
    ↓
Run Unit Tests
    ↓
Run Integration Tests
    ↓
Build Application
    ↓
Run E2E Tests
    ↓
Deploy to Staging
    ↓
Run Smoke Tests
    ↓
Deploy to Production
```

### GitHub Actions 配置
- 自動執行測試
- 自動檢查程式碼品質
- 自動部署

---

## 13. 故障排除

### 常見測試問題

#### 問題：測試超時
**解決方案：** 增加超時時間，檢查網路連接

#### 問題：隨機失敗
**解決方案：** 檢查測試隔離，使用固定種子

#### 問題：環境依賴
**解決方案：** 使用 Docker，隔離環境

---

## 14. 聯繫方式

- **測試負責人：** QA Team
- **郵件：** qa@ozystudio.com
- **Slack：** #testing

---

**最後更新：** 2026-05-19  
**版本：** 0.1.0  
**狀態：** 🟢 準備就緒
