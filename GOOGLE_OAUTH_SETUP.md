# Google OAuth 完整配置指南

## 📋 你的專案資訊

| 項目 | 值 |
|------|-----|
| **Supabase Project URL** | https://jpgdscxzxairefoakrch.supabase.co |
| **Vercel 部署網址** | https://ozzy-siteflow-npcfu6wku-ozzystudio2026s-projects.vercel.app |
| **OAuth Callback URI** | https://ozzy-siteflow-npcfu6wku-ozzystudio2026s-projects.vercel.app/auth/callback |

---

## 🔧 第一步：Google Cloud Console 配置

### 1.1 建立 OAuth 2.0 憑證

1. 訪問 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇你的專案（如果沒有請建立新專案）
3. 進入 **APIs & Services** → **Credentials**
4. 點擊 **Create Credentials** → **OAuth 2.0 Client ID**
5. 選擇應用類型：**Web application**
6. 填入以下資訊：

   ```
   名稱：OZY Studio Inspection System
   ```

### 1.2 設定授權重定向 URI

在 **Authorized redirect URIs** 中添加以下 URL：

```
https://jpgdscxzxairefoakrch.supabase.co/auth/v1/callback?provider=google
https://ozzy-siteflow-npcfu6wku-ozzystudio2026s-projects.vercel.app/auth/callback
```

### 1.3 複製憑證

建立完成後，複製以下資訊：
- **Client ID** - 用於前端
- **Client Secret** - 用於 Supabase（保密）

---

## 🔐 第二步：Supabase Auth Provider 配置

### 2.1 進入 Supabase 儀表板

1. 訪問 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇你的專案：`jpgdscxzxairefoakrch`
3. 進入 **Authentication** → **Providers**

### 2.2 啟用 Google Provider

1. 找到 **Google** 選項
2. 點擊啟用（Enable）
3. 填入以下資訊：

   ```
   Client ID: [從 Google Cloud Console 複製]
   Client Secret: [從 Google Cloud Console 複製]
   ```

4. 點擊 **Save**

### 2.3 驗證 Redirect URL

確保 Supabase 中的 Redirect URL 設定為：
```
https://ozzy-siteflow-npcfu6wku-ozzystudio2026s-projects.vercel.app/auth/callback
```

進入 **Authentication** → **URL Configuration** 檢查

---

## 🛣️ 第三步：建立 OAuth Callback Route

### 3.1 建立 callback 路由

需要在以下位置建立檔案：
```
app/auth/callback/route.ts
```

內容如下：

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  // 重定向到首頁或儀表板
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

---

## 🎨 第四步：修改登入頁面

### 4.1 添加 Google 登入按鈕

在 `app/(auth)/login/page.tsx` 中添加：

```typescript
const handleGoogleSignIn = async () => {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    setError(error.message)
  }
}
```

---

## 📝 環境變數

### 需要設定的環境變數

```env
# Supabase（已有）
NEXT_PUBLIC_SUPABASE_URL=https://jpgdscxzxairefoakrch.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[你的 Anon Key]

# Google OAuth（新增）
NEXT_PUBLIC_GOOGLE_CLIENT_ID=[從 Google Cloud Console 複製]
```

**注意：** `Client Secret` 不應該在前端環境變數中。它只在 Supabase 後端使用。

---

## ✅ 檢查清單

- [ ] 在 Google Cloud Console 建立 OAuth 2.0 憑證
- [ ] 在 Google Cloud Console 添加 Redirect URI
- [ ] 在 Supabase 啟用 Google Provider
- [ ] 在 Supabase 填入 Client ID 和 Client Secret
- [ ] 建立 `app/auth/callback/route.ts`
- [ ] 修改登入頁面，添加 Google 登入按鈕
- [ ] 設定環境變數
- [ ] 測試 Google 登入流程

---

## 🧪 測試步驟

1. 訪問登入頁面：https://ozzy-siteflow-npcfu6wku-ozzystudio2026s-projects.vercel.app/login
2. 點擊「Google 登入」按鈕
3. 使用 Google 帳號登入
4. 應該被重定向到 `/auth/callback`
5. 最後重定向到 `/dashboard`

---

## 🐛 常見問題排查

### 問題 1：Redirect URI 不匹配
**症狀：** 登入後出現 `redirect_uri_mismatch` 錯誤

**解決方案：**
- 確保 Google Cloud Console 中的 Redirect URI 完全匹配
- 確保 Supabase URL Configuration 中的 Redirect URL 正確

### 問題 2：Client ID 無效
**症狀：** 登入時出現 `invalid_client` 錯誤

**解決方案：**
- 檢查 Client ID 是否正確複製
- 確保 Client ID 未過期或被撤銷

### 問題 3：CORS 錯誤
**症狀：** 瀏覽器控制台出現 CORS 錯誤

**解決方案：**
- 確保 Authorized domains 在 Supabase 中正確設定
- 檢查 `NEXT_PUBLIC_SUPABASE_URL` 是否正確

---

## 📞 支援

如有問題，請檢查：
1. Supabase 日誌：Authentication → Logs
2. Google Cloud Console：APIs & Services → Credentials
3. 瀏覽器開發者工具：Network 和 Console 標籤
