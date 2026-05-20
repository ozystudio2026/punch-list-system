'use client';

import { useState } from 'react';
import type { Project } from '@/types';

interface ProjectFormProps {
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

export default function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    address: '',
    inspectionDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const project: Project = {
      id: Date.now().toString(),
      name: formData.name,
      owner: formData.owner,
      address: formData.address,
      inspectionDate: formData.inspectionDate,
      defects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(project);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">案名 *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
          placeholder="例：台北市信義路辦公室"
        />
      </div>

      <div>
        <label className="label">業主姓名 *</label>
        <input
          type="text"
          required
          value={formData.owner}
          onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          className="input"
          placeholder="例：王小姐"
        />
      </div>

      <div>
        <label className="label">地址 *</label>
        <input
          type="text"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="input"
          placeholder="例：台北市信義區信義路五段"
        />
      </div>

      <div>
        <label className="label">驗收日期 *</label>
        <input
          type="date"
          required
          value={formData.inspectionDate}
          onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
          className="input"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex-1"
        >
          取消
        </button>
        <button
          type="submit"
          className="btn btn-primary flex-1"
        >
          建立案件
        </button>
      </div>
    </form>
  );
}
