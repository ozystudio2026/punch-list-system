import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // 處理錯誤
  if (error) {
    console.error('OAuth Error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=${encodeURIComponent(errorDescription || error)}`,
        request.url
      )
    )
  }

  // 交換授權碼以獲取會話
  if (code) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Exchange Error:', exchangeError)
        return NextResponse.redirect(
          new URL(
            `/auth/login?error=${encodeURIComponent(exchangeError.message)}`,
            request.url
          )
        )
      }

      // 成功登入，重定向到專案頁面
      return NextResponse.redirect(new URL('/projects', request.url))
    } catch (err) {
      console.error('Callback Error:', err)
      return NextResponse.redirect(
        new URL('/auth/login?error=Authentication failed', request.url)
      )
    }
  }

  // 沒有授權碼或錯誤，重定向到登入頁面
  return NextResponse.redirect(new URL('/auth/login?error=No authorization code', request.url))
}
