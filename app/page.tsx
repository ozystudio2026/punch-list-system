'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // 已登入，重定向到專案列表
        router.push('/projects')
      } else {
        // 未登入，重定向到登入頁面
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  // 顯示加載狀態
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500">正在載入...</p>
      </div>
    </div>
  )
}
