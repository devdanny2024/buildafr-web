import { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle, MapPin, Calendar } from 'lucide-react';
import { api } from '../../lib/api';

interface Project {
  id: string;
  name: string;
}

interface Site {
  id: string;
  name: string;
  projectId: string;
}

interface AttendanceUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface AttendanceRecord {
  id: string;
  userId: string;
  siteId: string;
  checkInTime: string;
  checkOutTime: string | null;
  workHours: number | null;
  isVerified: boolean;
  verificationMethod: string;
  user: AttendanceUser;
}

interface DailyStats {
  date: string;
  total: number;
  verified: number;
  currentlyIn: number;
  uniqueWorkers: number;
}

function StatCard({ icon: Icon, label, value, color = '#F59E0B' }: {
  icon: typeof Users;
  label: string;
  value: string | number;
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
    </div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(hours: number | null) {
  if (hours == null) return '—';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

export function AttendancePage() {
  const today = new Date().toISOString().split('T')[0];

  const [projects, setProjects] = useState<Project[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Load projects on mount
  useEffect(() => {
    api.get<Project[] | { data: Project[] }>('/projects')
      .then(r => setProjects(Array.isArray(r) ? r : (r as { data: Project[] }).data ?? []))
      .catch(console.error)
      .finally(() => setProjectsLoading(false));
  }, []);

  // Load sites when project changes
  useEffect(() => {
    if (!selectedProject) { setSites([]); setSelectedSite(''); return; }
    api.get<Site[] | { data: Site[] }>(`/sites?projectId=${selectedProject}`)
      .then(r => {
        const list = Array.isArray(r) ? r : (r as { data: Site[] }).data ?? [];
        setSites(list);
        if (list.length > 0) setSelectedSite(list[0].id);
      })
      .catch(console.error);
  }, [selectedProject]);

  // Load records + stats when site or date changes
  useEffect(() => {
    if (!selectedSite) { setRecords([]); setStats(null); return; }
    setLoading(true);
    Promise.all([
      api.get<AttendanceRecord[]>(`/attendance/site/${selectedSite}?date=${date}&limit=100`),
      api.get<DailyStats>(`/attendance/site/${selectedSite}/stats?date=${date}`),
    ])
      .then(([recs, s]) => {
        setRecords(Array.isArray(recs) ? recs : []);
        setStats(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedSite, date]);

  const avgHours = records.length > 0
    ? (records.filter(r => r.workHours != null).reduce((sum, r) => sum + (r.workHours ?? 0), 0) /
       Math.max(1, records.filter(r => r.workHours != null).length))
    : 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Worker check-ins and on-site presence</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          disabled={projectsLoading}
          className="bg-[#111111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors min-w-[180px]"
        >
          <option value="">Select project…</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={selectedSite}
          onChange={e => setSelectedSite(e.target.value)}
          disabled={sites.length === 0}
          className="bg-[#111111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors min-w-[180px]"
        >
          <option value="">Select site…</option>
          {sites.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 bg-[#111111] border border-[#1E1E1E] rounded-xl px-3 py-2.5">
          <Calendar size={16} className="text-gray-500" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-transparent text-sm text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Summary cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total checked in" value={stats.total} />
          <StatCard icon={MapPin} label="Currently on site" value={stats.currentlyIn} color="#22c55e" />
          <StatCard icon={CheckCircle} label="Verified entries" value={stats.verified} color="#818cf8" />
          <StatCard icon={Clock} label="Avg hours worked" value={formatDuration(avgHours)} color="#f97316" />
        </div>
      )}

      {/* Records table */}
      {!selectedSite ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-10 text-center">
          <MapPin size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Select a project and site to view attendance</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : records.length === 0 ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-10 text-center">
          <Users size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No attendance records for this date</p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1E1E1E]">
            <h2 className="font-semibold text-white">Check-ins — {new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' })}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{records.length} record{records.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  {['Worker', 'Role', 'Check In', 'Check Out', 'Duration', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => {
                  const checkedOut = r.checkOutTime != null;
                  return (
                    <tr key={r.id} className={`border-b border-[#1E1E1E] hover:bg-[#161616] transition-colors ${i === records.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#F59E0B]/15 flex items-center justify-center text-xs text-[#F59E0B] font-bold shrink-0">
                            {r.user.firstName[0]}{r.user.lastName[0]}
                          </div>
                          <span className="text-white font-medium">{r.user.firstName} {r.user.lastName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{r.user.role?.replace(/_/g, ' ')}</td>
                      <td className="px-5 py-3 text-white">{formatTime(r.checkInTime)}</td>
                      <td className="px-5 py-3 text-white">{r.checkOutTime ? formatTime(r.checkOutTime) : <span className="text-gray-600">—</span>}</td>
                      <td className="px-5 py-3 text-white">{formatDuration(r.workHours)}</td>
                      <td className="px-5 py-3">
                        {checkedOut ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium text-[#22c55e] bg-[#22c55e]/10">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium text-[#F59E0B] bg-[#F59E0B]/10">
                            On site
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
