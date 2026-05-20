# 室內設計工程驗收系統

一個簡單、高效的工程驗收管理系統，專為室內設計公司設計。

## 功能

- **案件管理** - 建立、查看、刪除工程案件
- **缺失紀錄** - 記錄工程缺失、狀態追蹤
- **統計儀表板** - 即時查看驗收進度
- **本地存儲** - 無需後端，數據存儲在瀏覽器

## 技術棧

- Next.js 14 (App Router)
- React 18
- Tailwind CSS 4
- TypeScript
- localStorage

## 快速開始

```bash
# 安裝依賴
pnpm install

# 開發模式
pnpm dev

# 構建
pnpm build

# 生產模式
pnpm start
```

## 專案結構

```
punch-list-system/
├── app/
│   ├── layout.tsx          # 根 layout
│   ├── page.tsx            # 首頁入口
│   └── globals.css         # 全局樣式
├── components/
│   ├── InspectionApp.tsx   # 主應用組件
│   ├── ProjectForm.tsx     # 新增案件表單
│   ├── ProjectList.tsx     # 案件列表
│   ├── ProjectDetail.tsx   # 案件詳情
│   ├── DefectForm.tsx      # 新增缺失表單
│   └── DefectList.tsx      # 缺失列表
├── types.ts                # TypeScript 類型定義
├── package.json            # 依賴管理
├── next.config.js          # Next.js 配置
├── tsconfig.json           # TypeScript 配置
└── tailwind.config.js      # Tailwind 配置
```

## 數據結構

### Project
```typescript
{
  id: string;
  name: string;              // 案名
  owner: string;             // 業主姓名
  address: string;           // 地址
  inspectionDate: string;    // 驗收日期
  defects: Defect[];         // 缺失列表
  createdAt: string;         // 建立時間
  updatedAt: string;         // 更新時間
}
```

### Defect
```typescript
{
  id: string;
  title: string;             // 缺失名稱
  location: string;          // 位置
  status: 'pending' | 'completed' | 'overdue';  // 狀態
  severity: 'normal' | 'urgent';                // 優先級
  deadline: string;          // 改善期限
  notes: string;             // 備註
  photos: string[];          // 照片
  createdAt: string;         // 建立時間
  completedAt?: string;      // 完成時間
}
```

## 設計風格

- **配色** - 米白色背景 + 黑白灰
- **排版** - 清晰的卡片式設計
- **間距** - 充足的留白
- **字級** - 層級清晰
- **風格** - Apple + Muji + Nordic Minimal

## 部署

部署到 Vercel：

```bash
git push origin main
```

自動部署到 https://punch-list-system.vercel.app

## License

MIT
