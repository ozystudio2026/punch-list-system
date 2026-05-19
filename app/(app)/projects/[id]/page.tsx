'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'
import { getProjectById, getProjectStats } from '@/app/actions/projects'
import { getDefectsByProject } from '@/app/actions/defects'
import Link from 'next/link'
import DefectQuickAddModal from '@/components/DefectQuickAddModal'

interface Project {
  id: string
  company_id: string
  project_number: string
  name: string
  description: string | null
  client_name: string
  client_phone: string | null
  client_email: string | null
  client_line_id: string | null
  address: string | null
  location_notes: string | null
  inspection_date: string | null
  designer_id: string | null
  status: 'planning' | 'in_progress' | 'completed' | 'signed'
  completion_rate: number
  notion_page_id: string | null
  notion_last_sync: string | null
  designer_signature_id: string | null
  client_signature_id: string | null
  latest_report_id: string | null
  created_at: string
  updated_at: string
}

interface Defect {
  id: string
  title: string
  description: string
  status: string
  due_date: string
  priority: string
  assigned_to: string
  photos_count: number
  created_at: string
}

interface Stats {
  totalDefects: number
  pendingDefects: number
  completedDefects: number
  overdueDefects: number
  completionRate: number
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [defects, setDefects] = useState<Defect[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'defects'>('overview')
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getCurrentUser()
        if (!userData) {
          router.push('/login')
          return
        }

        const projectData = await getProjectById(projectId)
        setProject(projectData)

        const statsData = await getProjectStats(projectId)
        setStats(statsData)

        const defectsData = await getDefectsByProject(projectId)
        setDefects(defectsData)
      } catch (error) {
        console.error('載入資料失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [projectId, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-l-4 border-yellow-500 bg-yellow-50'
      case 'in_progress':
        return 'border-l-4 border-blue-500 bg-blue-50'
      case 'completed':
        return 'border-l-4 border-green-500 bg-green-50'
      case 'overdue':
        return 'border-l-4 border-red-500 bg-red-50'
      default:
        return 'border-l-4 border-gray-300'
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
      case 'overdue':
        return '已逾期'
      default:
        return status
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">載入中...</div>
      </div>
    )
  }

  if (!project || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">案件不存在</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="container py-6">
          <div className="flex-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/projects">
                <button className="btn btn-ghost">← 返回</button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-gray-500 text-sm mt-1">案件編號：{project.project_number}</p>
              </div>
            </div>
            <button
              onClick={() => setShowQuickAdd(true)}
              className="btn btn-primary btn-lg"
            >
              + 新增缺失
            </button>
          </div>

          {/* 標籤頁 */}
          <div className="flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              案件概覽
            </button>
            <button
              onClick={() => setActiveTab('defects')}
              className={`pb-3 font-semibold transition-colors ${
                activeTab === 'defects'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              缺失記錄 ({stats.totalDefects})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {activeTab === 'overview' ? (
          // 案件概覽
          <div className="space-y-8">
            {/* 統計卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card">
                <div className="text-gray-500 text-xs font-semibold mb-2">總缺失</div>
                <div className="text-3xl font-bold">{stats.totalDefects}</div>
              </div>

              <div className="card border-l-4 border-yellow-500">
                <div className="text-gray-500 text-xs font-semibold mb-2">待處理</div>
                <div className="text-3xl font-bold text-yellow-600">{stats.pendingDefects}</div>
              </div>

              <div className="card border-l-4 border-red-500">
                <div className="text-gray-500 text-xs font-semibold mb-2">已逾期</div>
                <div className="text-3xl font-bold text-red-600">{stats.overdueDefects}</div>
              </div>

              <div className="card border-l-4 border-green-500">
                <div className="text-gray-500 text-xs font-semibold mb-2">已完成</div>
                <div className="text-3xl font-bold text-green-600">{stats.completedDefects}</div>
              </div>
            </div>

            {/* 完成率 */}
            <div className="card">
              <div className="flex-between mb-4">
                <h3 className="font-semibold">完成進度</h3>
                <span className="text-2xl font-bold">{stats.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-black h-3 rounded-full transition-all"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
            </div>

            {/* 案件資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-semibold mb-4">客戶資訊</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">客戶名稱</p>
                    <p className="font-semibold">{project.client_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">聯絡電話</p>
                    <p className="font-semibold">{project.client_phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">案場地址</p>
                    <p className="font-semibold text-sm">{project.client_address}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4">驗收資訊</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">驗收日期</p>
                    <p className="font-semibold">{project.inspection_date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">案件狀態</p>
                    <span className="badge badge-success">{project.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 缺失記錄
          <div className="space-y-4">
            {defects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 text-center">
                  <p className="text-lg font-semibold mb-2">還沒有缺失記錄</p>
                  <p className="text-sm mb-6">現場發現缺失後可快速新增</p>
                  <button
                    onClick={() => setShowQuickAdd(true)}
                    className="btn btn-primary"
                  >
                    新增第一筆缺失
                  </button>
                </div>
              </div>
            ) : (
              defects.map((defect) => (
                <Link key={defect.id} href={`/projects/${projectId}/defects/${defect.id}`}>
                  <div className={`card hover:shadow-lg cursor-pointer transition-all ${getStatusColor(defect.status)}`}>
                    <div className="flex-between mb-3">
                      <h3 className="font-semibold text-lg">{defect.title}</h3>
                      <span className={`badge ${getStatusBadgeColor(defect.status)}`}>
                        {getStatusLabel(defect.status)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{defect.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">優先度</p>
                        <p className="font-semibold capitalize">{defect.priority}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">改善期限</p>
                        <p className="font-semibold">{defect.due_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">指派廠商</p>
                        <p className="font-semibold">{defect.assigned_to || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">照片</p>
                        <p className="font-semibold">{defect.photos_count} 張</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>

      {/* 快速新增缺失 Modal */}
      {showQuickAdd && (
        <DefectQuickAddModal
          projectId={projectId}
          onClose={() => setShowQuickAdd(false)}
          onSuccess={() => {
            setShowQuickAdd(false)
            // 重新載入缺失列表
            getDefectsByProject(projectId).then(setDefects)
          }}
        />
      )}
    </div>
  )
}
