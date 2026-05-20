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
        <label className="label">缺失名稱 *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input"
          placeholder="例：木地板不平"
        />
      </div>

      <div>
        <label className="label">區域位置 *</label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="input"
          placeholder="例：玄關入口"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="label">狀態 *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="select w-full"
          >
            <option value="pending">待改善</option>
            <option value="completed">已完成</option>
            <option value="overdue">逾期</option>
          </select>
        </div>

        <div className="w-full">
          <label className="label">優先級 *</label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
            className="select w-full"
          >
            <option value="normal">一般</option>
            <option value="urgent">緊急</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">改善期限 *</label>
        <input
          type="date"
          required
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className="input"
        />
      </div>

      <div>
        <label className="label">備註</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="textarea"
          placeholder="例：需要重新打磨並上漆"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-6 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary w-full md:flex-1"
        >
          取消
        </button>
        <button
          type="submit"
          className="btn btn-primary w-full md:flex-1"
        >
          {initialDefect ? '更新缺失' : '新增缺失'}
        </button>
      </div>
    </form>
  );
}
