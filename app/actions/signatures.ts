'use server'

import { createServerClient } from '@/lib/supabase'

interface SaveSignatureData {
  projectId: string
  ownerName: string
  ownerSignature: string
  designerName: string
  designerSignature: string
}

export async function saveSignature(data: SaveSignatureData) {
  const supabase = await createServerClient()

  try {
    // 1. 保存業主簽名
    const ownerSignaturePath = `signatures/${data.projectId}/owner-${Date.now()}.png`
    const { error: ownerError } = await supabase.storage
      .from('signatures')
      .upload(ownerSignaturePath, Buffer.from(data.ownerSignature.split(',')[1], 'base64'))

    if (ownerError) {
      throw new Error(`Failed to save owner signature: ${ownerError.message}`)
    }

    // 2. 保存設計師簽名
    const designerSignaturePath = `signatures/${data.projectId}/designer-${Date.now()}.png`
    const { error: designerError } = await supabase.storage
      .from('signatures')
      .upload(designerSignaturePath, Buffer.from(data.designerSignature.split(',')[1], 'base64'))

    if (designerError) {
      throw new Error(`Failed to save designer signature: ${designerError.message}`)
    }

    // 3. 更新專案記錄
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        status: 'signed',
        designer_signature_id: designerSignaturePath,
        client_signature_id: ownerSignaturePath,
      })
      .eq('id', data.projectId)

    if (updateError) {
      throw new Error(`Failed to update project: ${updateError.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving signature:', error)
    return { error: error instanceof Error ? error.message : 'Failed to save signature' }
  }
}

export async function getProjectSignatures(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('projects')
    .select('designer_signature_id, client_signature_id')
    .eq('id', projectId)
    .single()

  if (error) {
    console.error('Error fetching signatures:', error)
    return null
  }

  return data
}
