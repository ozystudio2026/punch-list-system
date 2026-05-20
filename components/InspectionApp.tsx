'use client';

import { useState, useEffect } from 'react';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';
import type { Project } from '@/types';

export default function InspectionApp() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 從 localStorage 載入資料
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load projects:', e);
      }
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects, isMounted]);

  const handleAddProject = (project: Project) => {
    setProjects([...projects, project]);
    setShowForm(false);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProject === id) {
      setSelectedProject(null);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);
    if (project) {
      return (
        <ProjectDetail
          project={project}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
          onBack={() => setSelectedProject(null)}
        />
      );
    }
  }

  return (
    <main className="min-h-screen bg-beige-50">
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            室內設計工程驗收系統
          </h1>
          <p className="text-sm text-gray-500 tracking-wide">INSPECTION SYSTEM</p>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">案件總數</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {projects.length}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-lg"
          >
            + 新增案件
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center z-50 p-4">
            <div className="bg-white w-full md:max-w-2xl md:rounded-lg rounded-t-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">新增案件</h2>
                  <p className="text-sm text-gray-500 mt-1">填寫案件基本資訊</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
              <ProjectForm
                onSubmit={handleAddProject}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Projects List or Empty State */}
        {projects.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">還沒有案件</h3>
            <p className="text-gray-500 mb-8">開始建立您的第一個工程驗收案件</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              新增第一個案件
            </button>
          </div>
        ) : (
          <ProjectList
            projects={projects}
            onSelectProject={setSelectedProject}
          />
        )}
      </div>
    </main>
  );
}
