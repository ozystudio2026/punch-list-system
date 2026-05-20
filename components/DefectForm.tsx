'use client';

import { useState } from 'react';
import type { Defect } from '@/types';

interface DefectFormProps {
  initialDefect?: Defect;
  onSubmit: (defect: Defect) => void;
  onCancel: () => void;
}

export default function DefectForm({
  initialDefect,
  onSubmit,
  onCancel,
}: DefectFormProps) {
  const [formData, setFormData] = useState({
    title: initialDefect?.title || '',
    location: initialDefect?.location || '',
    status: (initialDefect?.status || 'pending') as 'pending' | 'completed' | 'overdue',
    severity: (initialDefect?.severity || 'normal') as 'normal' | 'urgent',
    deadline: initialDefect?.deadline || new Date().toISOString().split('T')[0],
    notes: initialDefect?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();
    const defect: Defect = {
      id: initialDefect?.id || Date.now().toString(),
      title: formData.title,
      location: formData.location,
      status: formData.status,
      severity: formData.severity,
      deadline: formData.deadline,
      notes: formData.notes,
      photos: initialDefect?.photos || [],
      createdAt: initialDefect?.createdAt || now,
      completedAt: formData.status === 'completed' ? now : initialDefect?.completedAt,
    };

    onSubmit(defect);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          缺失名稱 *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
          placeholder="例：木地板不平"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          區域位置 *
        </label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
          placeholder="例：玄關入口"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            狀態 *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-gray-900"
          >
            <option value="pending">待改善</option>
            <option value="completed">已完成</option>
            <option value="overdue">逾期</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            優先級 *
          </label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-gray-900"
          >
            <option value="normal">一般</option>
            <option value="urgent">緊急</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          改善期限 *
        </label>
        <input
          type="date"
          required
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          備註
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 resize-none"
          rows={4}
          placeholder="例：需要重新打磨並上漆"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
        >
          {initialDefect ? '更新缺失' : '新增缺失'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
