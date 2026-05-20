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
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-900 mb-6 font-medium uppercase tracking-wide"
          >
            ← 返回列表
          </button>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-600">{project.owner}</p>
            </div>
            <button
              onClick={handleDeleteProject}
              className="btn btn-secondary btn-sm self-start md:self-auto"
            >
              刪除案件
            </button>
          </div>
        </div>

        {/* Project Info Card */}
        <div className="card-white mb-8 md:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">地址</p>
              <p className="font-semibold text-gray-900">{project.address}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">驗收日期</p>
              <p className="font-semibold text-gray-900">
                {new Date(project.inspectionDate).toLocaleDateString('zh-TW')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">完成度</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total === 0 ? '0' : Math.round((stats.completed / stats.total) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-12">
          <div className="card-white text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">全部缺失</p>
          </div>
          <div className="card-white text-center">
            <p className="text-3xl font-bold text-green-600 mb-1">{stats.completed}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">已完成</p>
          </div>
          <div className="card-white text-center">
            <p className="text-3xl font-bold text-yellow-600 mb-1">{stats.pending}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">待改善</p>
          </div>
          <div className="card-white text-center">
            <p className="text-3xl font-bold text-red-600 mb-1">{stats.overdue}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">逾期</p>
          </div>
        </div>

        {/* Defects Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">缺失紀錄</h2>
              <p className="text-sm text-gray-500 mt-1">共 {stats.total} 筆</p>
            </div>
            <button
              onClick={() => setShowDefectForm(true)}
              className="btn btn-primary btn-lg self-start md:self-auto"
            >
              + 新增缺失
            </button>
          </div>

          {/* Defect Form Modal */}
          {showDefectForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center z-50 p-4">
              <div className="bg-white w-full md:max-w-2xl md:rounded-lg rounded-t-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">新增缺失</h3>
                    <p className="text-sm text-gray-500 mt-1">記錄工程缺失詳情</p>
                  </div>
                  <button
                    onClick={() => setShowDefectForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
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
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center z-50 p-4">
              <div className="bg-white w-full md:max-w-2xl md:rounded-lg rounded-t-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">編輯缺失</h3>
                    <p className="text-sm text-gray-500 mt-1">更新缺失資訊</p>
                  </div>
                  <button
                    onClick={() => setEditingDefect(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
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
            <div className="card-white text-center py-16">
              <div className="mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <p className="text-gray-600 mb-4 font-medium">還沒有缺失紀錄</p>
              <button
                onClick={() => setShowDefectForm(true)}
                className="btn btn-primary"
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
