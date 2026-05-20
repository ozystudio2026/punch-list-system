'use client';

import type { Defect } from '@/types';

interface DefectListProps {
  defects: Defect[];
  onEdit: (defect: Defect) => void;
  onDelete: (id: string) => void;
}

const statusBadgeColors = {
  pending: 'badge-warning',
  completed: 'badge-success',
  overdue: 'badge-error',
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
          className={`card-white border-l-4 ${
            defect.status === 'completed'
              ? 'border-l-green-500'
              : defect.status === 'overdue'
              ? 'border-l-red-500'
              : 'border-l-yellow-500'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {defect.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">位置：{defect.location}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 self-start md:self-auto">
              <button
                onClick={() => onEdit(defect)}
                className="btn btn-secondary btn-sm"
              >
                編輯
              </button>
              <button
                onClick={() => {
                  if (confirm('確定要刪除此缺失嗎？')) {
                    onDelete(defect.id);
                  }
                }}
                className="btn btn-secondary btn-sm text-red-600 hover:bg-red-50"
              >
                刪除
              </button>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`badge ${statusBadgeColors[defect.status]}`}>
              {statusLabels[defect.status]}
            </span>
            <span className="badge badge-neutral">
              {severityLabels[defect.severity]}
            </span>
            {isOverdue(defect.deadline) && defect.status !== 'completed' && (
              <span className="badge badge-error">
                ⚠️ 逾期未改善
              </span>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">改善期限</p>
              <p className="font-semibold text-gray-900">
                {new Date(defect.deadline).toLocaleDateString('zh-TW')}
              </p>
            </div>

            {defect.notes && (
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">備註</p>
                <p className="text-gray-700">{defect.notes}</p>
              </div>
            )}

            {defect.completedAt && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">完成時間</p>
                <p className="font-semibold text-green-600">
                  {new Date(defect.completedAt).toLocaleDateString('zh-TW')}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
