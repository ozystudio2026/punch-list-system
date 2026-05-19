'use server'

import { createServerClient } from '@/lib/supabase'

export async function getProjectById(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data
}

export async function getProjectStats(projectId: string) {
  const supabase = await createServerClient()

  const { data: defects, error } = await supabase
    .from('defects')
    .select('status')
    .eq('project_id', projectId)

  if (error) {
    console.error('Error fetching defects:', error)
    return {
      totalDefects: 0,
      pendingDefects: 0,
      completedDefects: 0,
      overdueDefects: 0,
      completionRate: 0,
    }
  }

  const totalDefects = defects?.length || 0
  const pendingDefects = defects?.filter((d) => d.status === 'pending').length || 0
  const completedDefects = defects?.filter((d) => d.status === 'completed').length || 0
  const overdueDefects = defects?.filter((d) => d.status === 'overdue').length || 0
  const completionRate = totalDefects > 0 ? (completedDefects / totalDefects) * 100 : 0

  return {
    totalDefects,
    pendingDefects,
    completedDefects,
    overdueDefects,
    completionRate,
  }
}

export async function updateProject(projectId: string, data: any) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', projectId)

  if (error) {
    console.error('Error updating project:', error)
    return { error: error.message }
  }

  return { success: true }
}
