'use server'

import { createServerClient } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Defect = Database['public']['Tables']['defects']['Row']
type DefectInsert = Database['public']['Tables']['defects']['Insert']
type DefectPhoto = Database['public']['Tables']['defect_photos']['Row']

// 取得案件的所有缺失
export async function getDefectsByProject(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('defects')
    .select(
      `
      *,
      defect_photos(*)
    `
    )
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// 取得單個缺失詳情
export async function getDefectById(defectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('defects')
    .select(
      `
      *,
      defect_photos(*)
    `
    )
    .eq('id', defectId)
    .single()

  if (error) {
    throw error
  }

  return data
}

// 快速建立缺失（iPad 現場操作）
export async function createDefectQuick(defectData: {
  projectId: string
  title: string
  description?: string
  location?: string
  severity?: 'minor' | 'normal' | 'critical'
  deadline?: string
  contractorId?: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('未授權')
  }

  const { data, error } = await supabase
    .from('defects')
    .insert([
      {
        project_id: defectData.projectId,
        title: defectData.title,
        description: defectData.description,
        location: defectData.location,
        severity: defectData.severity || 'normal',
        status: 'pending',
        deadline: defectData.deadline,
        contractor_id: defectData.contractorId,
        reported_by: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Defect
}

// 更新缺失狀態
export async function updateDefectStatus(
  defectId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'overdue'
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('未授權')
  }

  const updateData: any = {
    status,
  }

  // 如果是完成狀態，記錄完成時間
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
  }

  // 如果是驗證狀態，記錄驗證時間和驗證人
  if (status === 'verified') {
    updateData.verified_at = new Date().toISOString()
    updateData.verified_by = user.id
  }

  const { data, error } = await supabase
    .from('defects')
    .update(updateData)
    .eq('id', defectId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Defect
}

// 更新缺失詳情
export async function updateDefect(defectId: string, updates: Partial<DefectInsert>) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('defects')
    .update(updates)
    .eq('id', defectId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Defect
}

// 刪除缺失
export async function deleteDefect(defectId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('defects')
    .delete()
    .eq('id', defectId)

  if (error) {
    throw error
  }

  return { success: true }
}

// 上傳缺失照片
export async function uploadDefectPhoto(
  defectId: string,
  file: File,
  photoType: 'before' | 'after' | 'progress' = 'before'
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('未授權')
  }

  // 1. 上傳檔案到 Storage
  const fileName = `${defectId}/${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage
    .from('defect-photos')
    .upload(fileName, file)

  if (uploadError) {
    throw uploadError
  }

  // 2. 取得公開 URL
  const { data: urlData } = supabase.storage
    .from('defect-photos')
    .getPublicUrl(fileName)

  // 3. 建立照片記錄
  const { data, error } = await supabase
    .from('defect_photos')
    .insert([
      {
        defect_id: defectId,
        photo_url: urlData.publicUrl,
        storage_path: fileName,
        photo_type: photoType,
        uploaded_by: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as DefectPhoto
}

// 刪除缺失照片
export async function deleteDefectPhoto(photoId: string) {
  const supabase = await createServerClient()

  // 1. 取得照片資訊
  const { data: photo } = await supabase
    .from('defect_photos')
    .select('storage_path')
    .eq('id', photoId)
    .single()

  if (photo?.storage_path) {
    // 2. 刪除 Storage 中的檔案
    await supabase.storage
      .from('defect-photos')
      .remove([photo.storage_path])
  }

  // 3. 刪除資料庫記錄
  const { error } = await supabase
    .from('defect_photos')
    .delete()
    .eq('id', photoId)

  if (error) {
    throw error
  }

  return { success: true }
}

// 取得逾期缺失
export async function getOverdueDefects(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('defects')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_overdue', true)
    .neq('status', 'verified')

  if (error) {
    throw error
  }

  return data as Defect[]
}

// 取得即將到期的缺失（7 天內）
export async function getUpcomingDefects(projectId: string) {
  const supabase = await createServerClient()

  const today = new Date()
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from('defects')
    .select('*')
    .eq('project_id', projectId)
    .gte('deadline', today.toISOString().split('T')[0])
    .lte('deadline', sevenDaysLater.toISOString().split('T')[0])
    .neq('status', 'verified')

  if (error) {
    throw error
  }

  return data as Defect[]
}

// 批量更新缺失狀態
export async function batchUpdateDefectsStatus(
  defectIds: string[],
  status: 'pending' | 'in_progress' | 'completed' | 'verified'
) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('defects')
    .update({ status })
    .in('id', defectIds)

  if (error) {
    throw error
  }

  return { success: true }
}
