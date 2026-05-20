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
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            室內設計工程驗收系統
          </h1>
          <p className="text-gray-500">INSPECTION SYSTEM</p>
        </div>

        {/* Actions */}
        <div className="mb-8 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-900">{projects.length}</span> 個案件
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            + 新增案件
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
            <div className="bg-white w-full md:max-w-2xl md:rounded-lg rounded-t-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">新增案件</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
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

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">還沒有案件</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-gray-900 font-medium hover:underline"
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
