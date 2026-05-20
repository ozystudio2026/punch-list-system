'use client';

import type { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
}

export default function ProjectList({ projects, onSelectProject }: ProjectListProps) {
  const getStats = (project: Project) => {
    const total = project.defects.length;
    const completed = project.defects.filter(d => d.status === 'completed').length;
    const overdue = project.defects.filter(d => d.status === 'overdue').length;
    return { total, completed, overdue };
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const stats = getStats(project);
        const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

        return (
          <div
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className="card-white cursor-pointer group"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {project.owner}
                </p>
                <p className="text-xs text-gray-500">
                  {project.address}
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6 md:gap-8">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">全部</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">已完成</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">逾期</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">完成度</p>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{completionRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                驗收日期：{new Date(project.inspectionDate).toLocaleDateString('zh-TW')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
