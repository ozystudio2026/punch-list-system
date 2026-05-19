'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'
import { getDefectById, updateDefectStatus } from '@/app/actions/defects'
import Link from 'next/link'
import PhotoGallery from '@/components/PhotoGallery'

interface Defect {
  id: string
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  assigned_to: string
  photos: Array<{
    id: string
    file_path: string
    uploaded_at: string
  }>
  created_at: string
  updated_at: string
}

export default function DefectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const defectId = params.defectId as string

  const [defect, setDefect] = useState<Defect | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  useEffect(() => {
    const loadDefect = async () => {
      try {
        const userData = await getCurrentUser()
        if (!userData) {
          router.push('/login')
          return
        }

        const defectData = await getDefectById(defectId)
        setDefect(defectData)
      } catch (error) {
        console.error('載入缺失失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDefect()
  }, [defectId, router])

  const handleStatusChange = async (newStatus: string) => {
    if (!defect) return

    setIsUpdating(true)
    try {
      const validStatus = newStatus as 'pending' | 'in_progress' | 'completed' | 'verified' | 'overdue'
      await updateDefectStatus(defectId, validStatus)
      setDefect({ ...defect, status: newStatus })
    } catch (error) {
      console.error('更新狀態失敗:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'verified':
        return 'bg-green-200 text-green-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '待處理'
      case 'in_progress':
        return '改善中'
      case 'completed':
        return '已完成'
      case 'verified':
        return '已驗收'
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return '低'
      case 'medium':
        return '中'
      case 'high':
        return '高'
      case 'urgent':
        return '緊急'
      default:
        return priority
    }
  }

  const isOverdue = defect?.due_date && new Date(defect.due_date) < new Date()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">載入中...</div>
      </div>
    )
  }

  if (!defect) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">缺失不存在</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/projects/${projectId}`}>
              <button className="btn btn-ghost">← 返回</button>
            </Link>
            <h1 className="text-2xl font-bold flex-1">{defect.title}</h1>
            <span className={`badge ${getStatusColor(defect.status)}`}>
              {getStatusLabel(defect.status)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側 - 照片 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 照片庫 */}
          {defect.photos.length > 0 ? (
            <div>
              <h2 className="text-lg font-bold mb-4">現場照片</h2>
              <PhotoGallery
                photos={defect.photos}
                onPhotoSelect={(photo) => setSelectedPhoto(photo.file_path)}
              />

              {/* 照片詳情 */}
              {selectedPhoto && (
                <div className="mt-6 card">
                  <img
                    src={selectedPhoto}
                    alt="Selected"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500">還沒有上傳照片</p>
            </div>
          )}

          {/* 缺失描述 */}
          <div className="card">
            <h3 className="font-semibold mb-4">缺失描述</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{defect.description}</p>
          </div>

          {/* 時間線 */}
          <div className="card">
            <h3 className="font-semibold mb-4">時間線</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-sm">缺失建立</p>
                  <p className="text-xs text-gray-500">{new Date(defect.created_at).toLocaleString('zh-TW')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-sm">最後更新</p>
                  <p className="text-xs text-gray-500">{new Date(defect.updated_at).toLocaleString('zh-TW')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右側 - 控制面板 */}
        <div className="space-y-6">
          {/* 狀態控制 */}
          <div className="card">
            <h3 className="font-semibold mb-4">狀態管理</h3>
            <div className="space-y-2">
              {['pending', 'in_progress', 'completed', 'verified'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                  className={`w-full p-3 rounded border-2 transition-all text-left ${
                    defect.status === status
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-sm">{getStatusLabel(status)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 基本資訊 */}
          <div className="card">
            <h3 className="font-semibold mb-4">基本資訊</h3>
            <div className="space-y-4">
              {/* 優先度 */}
              <div>
                <p className="text-xs text-gray-500 mb-1">優先度</p>
                <p className="font-semibold capitalize">{getPriorityLabel(defect.priority)}</p>
              </div>

              {/* 改善期限 */}
              <div>
                <p className="text-xs text-gray-500 mb-1">改善期限</p>
                <p className={`font-semibold ${isOverdue ? 'text-red-600' : ''}`}>
                  {defect.due_date || '-'}
                  {isOverdue && <span className="text-xs ml-2 text-red-600">（已逾期）</span>}
                </p>
              </div>

              {/* 指派廠商 */}
              <div>
                <p className="text-xs text-gray-500 mb-1">指派廠商</p>
                <p className="font-semibold">{defect.assigned_to || '-'}</p>
              </div>

              {/* 照片數量 */}
              <div>
                <p className="text-xs text-gray-500 mb-1">照片數量</p>
                <p className="font-semibold">{defect.photos.length} 張</p>
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className="card">
            <h3 className="font-semibold mb-4">快速操作</h3>
            <div className="space-y-2">
              <button className="btn btn-primary w-full">編輯缺失</button>
              <button className="btn btn-secondary w-full">新增照片</button>
              <button className="btn btn-ghost w-full">刪除缺失</button>
            </div>
          </div>

          {/* 提醒 */}
          {isOverdue && (
            <div className="card border-l-4 border-red-500 bg-red-50">
              <p className="text-red-700 font-semibold text-sm">⚠️ 此缺失已逾期</p>
              <p className="text-red-600 text-xs mt-2">請立即安排廠商進行改善</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
