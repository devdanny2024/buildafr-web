import { useEffect, useState } from 'react';
import { FileText, AlertTriangle, MapPin } from 'lucide-react';
import { api } from '../../lib/api';

interface Project {
  id: string;
  name: string;
}

interface Report {
  id: string;
  date?: string;
  createdAt: string;
  workDescription?: string;
  progressPercentage?: number | null;
  hasIncident?: boolean;
  incidentTypes?: string[];
  incidentDescription?: string;
  site?: { name: string };
}

export function ReportsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    api.get<Project[] | { data: Project[] }>('/projects')
      .then(r => setProjects(Array.isArray(r) ? r : (r as { data: Project[] }).data ?? []))
      .catch(console.error)
      .finally(() => setProjectsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedProject) { setReports([]); return; }
    setLoading(true);
    api.get<Report[] | { data: Report[] }>(`/reports?projectId=${selectedProject}&limit=50`)
      .then(r => setReports(Array.isArray(r) ? r : (r as { data: Report[] }).data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedProject]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Daily Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Site supervisor reports and progress logs</p>
      </div>

      <div className="flex gap-3">
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          disabled={projectsLoading}
          className="bg-[#111111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors min-w-[220px]"
        >
          <option value="">Select project…</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {!selectedProject ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-10 text-center">
          <FileText size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Select a project to view reports</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-10 text-center">
          <FileText size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No reports submitted for this project yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#F59E0B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">
                        {new Date(r.date || r.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </span>
                      {r.hasIncident && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium text-red-400 bg-red-500/10">
                          <AlertTriangle size={10} /> Incident
                        </span>
                      )}
                    </div>
                    {r.site?.name && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-gray-500" />
                        <span className="text-xs text-gray-500">{r.site.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                {r.progressPercentage != null && (
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-[#F59E0B] font-bold text-xl leading-none">{r.progressPercentage}%</p>
                    <p className="text-xs text-gray-500 mt-0.5">progress</p>
                  </div>
                )}
              </div>

              {r.workDescription && (
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{r.workDescription}</p>
              )}

              {r.progressPercentage != null && (
                <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full"
                    style={{ width: `${Math.min(100, r.progressPercentage)}%` }}
                  />
                </div>
              )}

              {r.hasIncident && r.incidentDescription && (
                <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-3">
                  <p className="text-xs text-red-400 font-medium mb-1">Incident Report</p>
                  <p className="text-xs text-gray-400">{r.incidentDescription}</p>
                  {r.incidentTypes && r.incidentTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.incidentTypes.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
