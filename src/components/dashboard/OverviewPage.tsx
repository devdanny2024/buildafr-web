import { useEffect, useState } from 'react';
import { FolderOpen, CheckSquare, AlertTriangle, TrendingUp, Clock, Users } from 'lucide-react';
import { api } from '../../lib/api';

interface Stats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  overdueTasks: number;
  teamMembers: number;
  completionRate: number;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress?: number;
  endDate?: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
  projectName?: string;
}

function StatCard({ icon: Icon, label, value, sub, color = '#F59E0B' }: {
  icon: typeof FolderOpen;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: '#22c55e',
  PLANNING: '#F59E0B',
  ON_HOLD: '#f97316',
  COMPLETED: '#6b7280',
};

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: '#ef4444',
  MEDIUM: '#F59E0B',
  LOW: '#6b7280',
};

export function OverviewPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: Project[] } | Project[]>('/projects'),
      api.get<{ data: Task[] } | Task[]>('/tasks/my'),
      api.get<{ _count: { users: number } }>('/organizations/me'),
    ]).then(([p, t, org]) => {
      const pList = Array.isArray(p) ? p : (p as { data: Project[] }).data ?? [];
      const tList = Array.isArray(t) ? t : (t as { data: Task[] }).data ?? [];
      setProjects(pList.slice(0, 20));
      setTasks(tList.slice(0, 20));
      setTeamMembers(org?._count?.users ?? 0);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats: Stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
    totalTasks: tasks.length,
    overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length,
    teamMembers,
    completionRate: tasks.length
      ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100)
      : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Your construction portfolio at a glance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderOpen} label="Total Projects" value={stats.totalProjects} sub={`${stats.activeProjects} active`} />
        <StatCard icon={CheckSquare} label="My Tasks" value={stats.totalTasks} sub={`${stats.completionRate}% done`} color="#22c55e" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdueTasks} color="#ef4444" />
        <StatCard icon={Users} label="Team Members" value={stats.teamMembers} color="#818cf8" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Projects</h2>
            <a href="/dashboard/projects" className="text-xs text-[#F59E0B] hover:underline">View all</a>
          </div>
          {projects.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                    <FolderOpen size={14} className="text-[#F59E0B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    {p.endDate && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={10} /> {new Date(p.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      color: STATUS_COLOR[p.status] ?? '#6b7280',
                      background: `${STATUS_COLOR[p.status] ?? '#6b7280'}15`,
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">My Tasks</h2>
            <a href="/dashboard/tasks" className="text-xs text-[#F59E0B] hover:underline">View all</a>
          </div>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No tasks assigned</p>
          ) : (
            <div className="space-y-3">
              {tasks.filter(t => t.status !== 'DONE').slice(0, 5).map(t => (
                <div key={t.id} className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: PRIORITY_COLOR[t.priority] ?? '#6b7280' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{t.title}</p>
                    {t.dueDate && (
                      <p className={`text-xs flex items-center gap-1 ${
                        new Date(t.dueDate) < new Date() ? 'text-red-400' : 'text-gray-500'
                      }`}>
                        <Clock size={10} />
                        {new Date(t.dueDate).toLocaleDateString()}
                        {new Date(t.dueDate) < new Date() && ' · Overdue'}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{t.status?.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'New Project', href: '/dashboard/projects' },
            { label: 'View Tasks', href: '/dashboard/tasks' },
            { label: 'Financials', href: '/dashboard/financials' },
            { label: 'Team', href: '/dashboard/team' },
          ].map(a => (
            <a
              key={a.href}
              href={a.href}
              className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-gray-300 hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors"
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
