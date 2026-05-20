'use client';

import { useState } from 'react';
import type { Project, Defect } from '@/types';
import DefectForm from './DefectForm';
import DefectList from './DefectList';

interface ProjectDetailProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export default function ProjectDetail({
  project,
  onUpdate,
  onDelete,
  onBack,
}: ProjectDetailProps) {
  const [showDefectForm, setShowDefectForm] = useState(false);
  const [editingDefect, setEditingDefect] = useState<Defect | null>(null);

  const stats = {
    total: project.defects.length,
    completed: project.defects.filter(d => d.status === 'completed').length,
    pending: project.defects.filter(d => d.status === 'pending').length,
    overdue: project.defects.filter(d => d.status === 'overdue').length,
  };

  const handleAddDefect = (defect: Defect) => {
    const updated = {
      ...project,
      defects: [...project.defects, defect],
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updated);
    setShowDefectForm(false);
  };

  const handleUpdateDefect = (defect: Defect) => {
    const updated = {
      ...project,
      defects: project.defects.map(d => d.id === defect.id ? defect : d),
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updated);
    setEditingDefect(null);
  };

  const handleDeleteDefect = (id: string) => {
    const updated = {
      ...project,
      defects: project.defects.filter(d => d.id !== id),
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updated);
  };

  const handleDeleteProject = () => {
    if (confirm(`確定要刪除「${project.name}」嗎？`)) {
      onDelete(project.id);
      onBack();
    }
  };

  return (
    <main className="min-h-screen bg-beige-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 mb-4 font-medium"
            >
              ← 返回
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.owner}</p>
          </div>
          <button
            onClick={handleDeleteProject}
            className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
          >
            刪除案件
          </button>
        </div>

        {/* Project Info */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">地址</p>
              <p className="font-medium text-gray-900">{project.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">驗收日期</p>
              <p className="font-medium text-gray-900">
                {new Date(project.inspectionDate).toLocaleDateString('zh-TW')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">完成度</p>
              <p className="font-medium text-gray-900">
                {stats.total === 0 ? '0' : Math.round((stats.completed / stats.total) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">全部缺失</p>
          </div>
          <div className="bg-white border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">已完成</p>
          </div>
          <div className="bg-white border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">待改善</p>
          </div>
          <div className="bg-white border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-sm text-gray-600">逾期</p>
          </div>
        </div>

        {/* Defects Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">缺失紀錄</h2>
            <button
              onClick={() => setShowDefectForm(true)}
              className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              + 新增缺失
            </button>
          </div>

          {/* Defect Form Modal */}
          {showDefectForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
              <div className="bg-white w-full md:max-w-2xl md:rounded-lg rounded-t-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">新增缺失</h3>
                  <button
                    onClick={() => setShowDefectForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <DefectForm
                  onSubmit={handleAddDefect}
                  onCancel={() => setShowDefectForm(false)}
                />
              </div>
            </div>
          )}

          {/* Edit Defect Modal */}
          {editingDefect && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
              <div className="bg-white w-full md:max-w-2xl md:rounded-lg rounded-t-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">編輯缺失</h3>
                  <button
                    onClick={() => setEditingDefect(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <DefectForm
                  initialDefect={editingDefect}
                  onSubmit={handleUpdateDefect}
                  onCancel={() => setEditingDefect(null)}
                />
              </div>
            </div>
          )}

          {/* Defects List */}
          {project.defects.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">還沒有缺失紀錄</p>
              <button
                onClick={() => setShowDefectForm(true)}
                className="text-gray-900 font-medium hover:underline"
              >
                新增第一筆缺失
              </button>
            </div>
          ) : (
            <DefectList
              defects={project.defects}
              onEdit={setEditingDefect}
              onDelete={handleDeleteDefect}
            />
          )}
        </div>
      </div>
    </main>
  );
}
