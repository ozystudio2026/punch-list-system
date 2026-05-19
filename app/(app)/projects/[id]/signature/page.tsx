'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import SignaturePad from '@/components/SignaturePad'
import { saveSignature } from '@/app/actions/signatures'

export default function SignaturePage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [step, setStep] = useState<'owner' | 'designer' | 'completed'>('owner')
  const [ownerSignature, setOwnerSignature] = useState<string>('')
  const [ownerName, setOwnerName] = useState('')
  const [designerSignature, setDesignerSignature] = useState<string>('')
  const [designerName, setDesignerName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOwnerSignatureComplete = (dataUrl: string) => {
    setOwnerSignature(dataUrl)
  }

  const handleDesignerSignatureComplete = (dataUrl: string) => {
    setDesignerSignature(dataUrl)
  }

  const handleNextStep = async () => {
    if (step === 'owner') {
      if (!ownerSignature) {
        setError('請完成業主簽名')
        return
      }
      if (!ownerName.trim()) {
        setError('請輸入業主名稱')
        return
      }
      setError('')
      setStep('designer')
    } else if (step === 'designer') {
      if (!designerSignature) {
        setError('請完成設計師簽名')
        return
      }
      if (!designerName.trim()) {
        setError('請輸入設計師名稱')
        return
      }

      // 保存簽名
      setIsLoading(true)
      try {
        await saveSignature({
          projectId,
          ownerName,
          ownerSignature,
          designerName,
          designerSignature,
        })

        setError('')
        setStep('completed')
      } catch (err) {
        setError('簽名保存失敗，請重試')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step === 'designer') {
      setStep('owner')
    }
  }

  const handleComplete = () => {
    router.push(`/projects/${projectId}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="container py-6">
          <h1 className="text-2xl font-bold">驗收簽名</h1>
          <p className="text-gray-500 text-sm mt-2">
            {step === 'owner' && '步驟 1/2 - 業主簽名'}
            {step === 'designer' && '步驟 2/2 - 設計師簽名'}
            {step === 'completed' && '簽名已完成'}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-2xl">
        {step === 'completed' ? (
          // 完成頁面
          <div className="space-y-8">
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-2">簽名已完成</h2>
              <p className="text-gray-600 mb-6">
                驗收報告已記錄所有簽名，可立即產出 PDF 報告
              </p>

              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-xs text-gray-500 mb-1">業主簽名</p>
                  <p className="font-semibold">{ownerName}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-xs text-gray-500 mb-1">設計師簽名</p>
                  <p className="font-semibold">{designerName}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                className="btn btn-primary flex-1 btn-lg"
              >
                返回案件
              </button>
              <button className="btn btn-secondary flex-1 btn-lg">
                產出 PDF 報告
              </button>
            </div>
          </div>
        ) : (
          // 簽名頁面
          <div className="space-y-8">
            {/* 步驟指示器 */}
            <div className="flex gap-4">
              <div className={`flex-1 h-2 rounded-full ${step !== 'owner' ? 'bg-black' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 h-2 rounded-full ${(step as string) === 'designer' || (step as string) === 'completed' ? 'bg-black' : 'bg-gray-200'}`}></div>
            </div>

            {step === 'owner' && (
              <div className="space-y-6">
                <div>
                  <label className="label">業主名稱 *</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="請輸入業主名稱"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">業主簽名 *</label>
                  <SignaturePad
                    onSignatureComplete={handleOwnerSignatureComplete}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="btn btn-primary w-full btn-lg"
                >
                  下一步
                </button>
              </div>
            )}

            {step === 'designer' && (
              <div className="space-y-6">
                <div>
                  <label className="label">設計師名稱 *</label>
                  <input
                    type="text"
                    value={designerName}
                    onChange={(e) => setDesignerName(e.target.value)}
                    placeholder="請輸入設計師名稱"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">設計師簽名 *</label>
                  <SignaturePad
                    onSignatureComplete={handleDesignerSignatureComplete}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="btn btn-secondary flex-1"
                  >
                    上一步
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={isLoading}
                    className="btn btn-primary flex-1"
                  >
                    {isLoading ? '保存中...' : '完成簽名'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
