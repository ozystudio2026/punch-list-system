'use client'

import { useState, useRef } from 'react'

interface PhotoUploadProps {
  onPhotosSelected: (files: File[]) => void
  maxFiles?: number
}

export default function PhotoUpload({ onPhotosSelected, maxFiles = 10 }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const files = Array.from(e.target.files || [])

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`最多只能上傳 ${maxFiles} 張照片`)
      return
    }

    // 驗證檔案類型
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('只能上傳圖片檔案')
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles]
      setSelectedFiles(newFiles)
      onPhotosSelected(newFiles)
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onPhotosSelected(newFiles)
  }

  const handleCameraCapture = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* 上傳按鈕 */}
      <button
        type="button"
        onClick={handleCameraCapture}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 transition-colors"
      >
        📷 點擊上傳照片或拍照
      </button>

      {/* 隱藏的檔案輸入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 錯誤訊息 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 已選擇的檔案 */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            已選擇 {selectedFiles.length}/{maxFiles} 張照片
          </p>
          <div className="grid grid-cols-3 gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
