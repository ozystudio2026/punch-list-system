'use client'

import { useState, useRef } from 'react'
import { createDefectQuick } from '@/app/actions/defects'
import PhotoUpload from './PhotoUpload'

interface DefectQuickAddModalProps {
  projectId: string
  onClose: () => void
  onSuccess: () => void
}

export default function DefectQuickAddModal({
  projectId,
  onClose,
  onSuccess,
}: DefectQuickAddModalProps) {
  const [step, setStep] = useState<'photos' | 'details' | 'assign'>('photos')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddPhotos = (newPhotos: File[]) => {
    setPhotos([...photos, ...newPhotos])
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (step === 'photos') {
      if (photos.length === 0) {
        setError('請至少上傳一張照片')
        return
      }
      setError('')
      setStep('details')
    } else if (step === 'details') {
      if (!title.trim()) {
        setError('請填寫缺失標題')
        return
      }
      setError('')
      setStep('assign')
    }
  }

  const handleBack = () => {
    if (step === 'details') {
      setStep('photos')
    } else if (step === 'assign') {
      setStep('details')
    }
  }

  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)

    try {
      await createDefectQuick({
        projectId,
        title,
        description,
        deadline: dueDate,
        severity: priority as 'minor' | 'normal' | 'critical',
        contractorId: assignedTo,
      })

      onSuccess()
    } catch (err) {
      setError('新增缺失失敗，請重試')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      {/* Modal */}
      <div className="w-full bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex-between">
          <h2 className="text-xl font-bold">
            {step === 'photos' && '新增缺失 - 拍照'}
            {step === 'details' && '新增缺失 - 描述'}
            {step === 'assign' && '新增缺失 - 指派'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 步驟 1: 拍照 */}
          {step === 'photos' && (
            <div className="space-y-4">
              <p className="text-gray-600">現場快速拍照記錄缺失</p>
              <PhotoUpload
                onPhotosSelected={handleAddPhotos}
                maxFiles={10}
              />

              {/* 已上傳照片預覽 */}
              {photos.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-3">已上傳 ({photos.length} 張)</p>
                  <div className="grid grid-cols-3 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded border border-gray-200"
                        />
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* 步驟 2: 描述 */}
          {step === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="label">缺失標題 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：客廳油漆色差"
                  className="input"
                />
              </div>

              <div>
                <label className="label">詳細描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述缺失的具體情況..."
                  className="textarea"
                />
              </div>

              <div>
                <label className="label">改善期限</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="label">優先度</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="select"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                  <option value="urgent">緊急</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* 步驟 3: 指派 */}
          {step === 'assign' && (
            <div className="space-y-4">
              <div>
                <label className="label">指派廠商</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="輸入廠商名稱"
                  className="input"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p className="font-semibold text-sm">確認資訊</p>
                <div className="space-y-2 text-sm">
                  <div className="flex-between">
                    <span className="text-gray-600">標題：</span>
                    <span className="font-semibold">{title}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-gray-600">照片：</span>
                    <span className="font-semibold">{photos.length} 張</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-gray-600">優先度：</span>
                    <span className="font-semibold capitalize">{priority}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-gray-600">期限：</span>
                    <span className="font-semibold">{dueDate || '-'}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - 按鈕 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          {step !== 'photos' && (
            <button
              onClick={handleBack}
              className="btn btn-secondary flex-1"
              disabled={isLoading}
            >
              上一步
            </button>
          )}

          {step !== 'assign' ? (
            <button
              onClick={handleNext}
              className="btn btn-primary flex-1 btn-lg"
              disabled={isLoading}
            >
              下一步
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn btn-primary flex-1 btn-lg"
              disabled={isLoading}
            >
              {isLoading ? '新增中...' : '完成新增'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
