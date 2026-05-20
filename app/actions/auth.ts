'use server'

import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

// 登入
export async function signIn(email: string, password: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, user: data.user }
}

// 註冊
export async function signUp(email: string, password: string, name: string) {
  const supabase = await createServerClient()

  // 1. 建立 Auth 使用者
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  // 2. 建立或取得公司
  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .insert([{ name: '新公司' }])
    .select()
    .single()

  if (companyError) {
    return { error: '建立公司失敗' }
  }

  // 3. 建立使用者記錄
  const { error: userError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user?.id,
        email,
        name,
        role: 'admin', // 第一個使用者是管理員
        company_id: companyData.id,
      },
    ])

  if (userError) {
    return { error: '建立使用者失敗' }
  }

  return { success: true, user: authData.user }
}

// 登出
export async function signOut() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

// 取得目前使用者
export async function getCurrentUser() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // 取得使用者詳細資訊
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!userData) {
    return null
  }

  // 取得公司資訊
  const { data: companyData } = await supabase
    .from('companies')
    .select('*')
    .eq('id', userData.company_id)
    .single()

  return {
    user: userData,
    company: companyData,
  }
}
