'use client'

import { useRef, useEffect, useState } from 'react'

interface SignaturePadProps {
  onSignatureChange?: (dataUrl: string) => void
  onSignatureComplete?: (dataUrl: string) => void
  disabled?: boolean
}

export default function SignaturePad({
  onSignatureChange,
  onSignatureComplete,
  disabled = false,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  // 初始化 Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 設定 Canvas 尺寸（高 DPI 支援）
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = '#ffffff'

    // 填充白色背景
    ctx.fillRect(0, 0, rect.width, rect.height)

    setContext(ctx)
  }, [])

  // 獲取滑鼠/觸控位置
  const getCoordinates = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()

    if (e instanceof TouchEvent) {
      const touch = e.touches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  // 開始繪製
  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || !context) return

    const coords = getCoordinates(e.nativeEvent as MouseEvent | TouchEvent)
    if (!coords) return

    setIsDrawing(true)
    context.beginPath()
    context.moveTo(coords.x, coords.y)
  }

  // 繪製中
  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return

    const coords = getCoordinates(e.nativeEvent as MouseEvent | TouchEvent)
    if (!coords) return

    context.lineTo(coords.x, coords.y)
    context.stroke()

    if (isEmpty) {
      setIsEmpty(false)
    }

    // 即時回調
    if (onSignatureChange) {
      onSignatureChange(canvasRef.current?.toDataURL() || '')
    }
  }

  // 結束繪製
  const handleEnd = () => {
    if (!context) return

    setIsDrawing(false)
    context.closePath()

    // 完成回調
    if (!isEmpty && onSignatureComplete) {
      onSignatureComplete(canvasRef.current?.toDataURL() || '')
    }
  }

  // 清除簽名
  const handleClear = () => {
    if (!context || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, rect.width, rect.height)
    context.fillStyle = '#000000'

    setIsEmpty(true)

    if (onSignatureChange) {
      onSignatureChange('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className={`w-full cursor-crosshair ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          style={{ minHeight: '200px', touchAction: 'none' }}
        />
      </div>

      {/* 提示文字 */}
      <p className="text-xs text-gray-500 text-center">
        {isEmpty ? '請在上方簽名' : '簽名已記錄'}
      </p>

      {/* 按鈕 */}
      <div className="flex gap-2">
        <button
          onClick={handleClear}
          disabled={isEmpty || disabled}
          className="btn btn-secondary flex-1"
        >
          清除
        </button>
        <button
          disabled={isEmpty || disabled}
          className="btn btn-primary flex-1"
        >
          確認簽名
        </button>
      </div>

      {/* 預覽 */}
      {!isEmpty && (
        <div className="card">
          <p className="text-xs font-semibold mb-2">簽名預覽</p>
          <canvas
            ref={canvasRef}
            className="w-full border border-gray-200 rounded"
            style={{ maxHeight: '100px' }}
          />
        </div>
      )}
    </div>
  )
}
