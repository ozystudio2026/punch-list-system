'use client'

import { useState } from 'react'

interface Photo {
  id: string
  file_path: string
  uploaded_at: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  onPhotoSelect?: (photo: Photo) => void
}

export default function PhotoGallery({ photos, onPhotoSelect }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
    onPhotoSelect?.(photo)
  }

  return (
    <div className="space-y-4">
      {/* 照片網格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => handlePhotoClick(photo)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
              selectedPhoto?.id === photo.id ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <img
              src={photo.file_path}
              alt="Defect photo"
              className="w-full h-32 object-cover hover:opacity-75 transition-opacity"
            />
          </div>
        ))}
      </div>

      {/* 詳細檢視 */}
      {selectedPhoto && (
        <div className="mt-6">
          <img
            src={selectedPhoto.file_path}
            alt="Selected photo"
            className="w-full rounded-lg"
          />
          <p className="text-sm text-gray-500 mt-2">
            上傳時間：{new Date(selectedPhoto.uploaded_at).toLocaleString()}
          </p>
        </div>
      )}

      {/* 空狀態 */}
      {photos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>尚無照片</p>
        </div>
      )}
    </div>
  )
}
