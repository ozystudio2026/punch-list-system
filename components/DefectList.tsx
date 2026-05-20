'use client';

import type { Defect } from '@/types';

interface DefectListProps {
  defects: Defect[];
  onEdit: (defect: Defect) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  pending: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  completed: 'bg-green-50 border-green-200 text-green-700',
  overdue: 'bg-red-50 border-red-200 text-red-700',
};

const statusLabels = {
  pending: '待改善',
  completed: '已完成',
  overdue: '逾期',
};

const severityLabels = {
  normal: '一般',
  urgent: '緊急',
};

export default function DefectList({
  defects,
  onEdit,
  onDelete,
}: DefectListProps) {
  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-4">
      {defects.map((defect, index) => (
        <div
          key={defect.id}
          className={`border p-6 ${statusColors[defect.status]}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {defect.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">位置：{defect.location}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(defect)}
                className="px-3 py-1 text-sm border border-current rounded hover:opacity-70 transition-opacity"
              >
                編輯
              </button>
              <button
                onClick={() => {
                  if (confirm('確定要刪除此缺失嗎？')) {
                    onDelete(defect.id);
                  }
                }}
                className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
              >
                刪除
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block px-3 py-1 bg-white bg-opacity-50 rounded text-sm font-medium">
              {statusLabels[defect.status]}
            </span>
            <span className="inline-block px-3 py-1 bg-white bg-opacity-50 rounded text-sm font-medium">
              {severityLabels[defect.severity]}
            </span>
            {isOverdue(defect.deadline) && defect.status !== 'completed' && (
              <span className="inline-block px-3 py-1 bg-red-200 text-red-800 rounded text-sm font-medium">
                逾期未改善
              </span>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-600">改善期限：</span>
              <span className="font-medium">
                {new Date(defect.deadline).toLocaleDateString('zh-TW')}
              </span>
            </p>
            {defect.notes && (
              <p>
                <span className="text-gray-600">備註：</span>
                <span className="font-medium">{defect.notes}</span>
              </p>
            )}
            {defect.completedAt && (
              <p>
                <span className="text-gray-600">完成時間：</span>
                <span className="font-medium">
                  {new Date(defect.completedAt).toLocaleDateString('zh-TW')}
                </span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
