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
            className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {project.owner} • {project.address}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {completionRate}%
                </div>
                <p className="text-xs text-gray-500">完成度</p>
              </div>
            </div>

            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-600">全部</span>
                <div className="font-semibold text-gray-900">{stats.total}</div>
              </div>
              <div>
                <span className="text-gray-600">已完成</span>
                <div className="font-semibold text-gray-900">{stats.completed}</div>
              </div>
              <div>
                <span className="text-gray-600">逾期</span>
                <div className="font-semibold text-red-600">{stats.overdue}</div>
              </div>
            </div>

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
