import { useEffect, useState } from 'react';
import { Camera, MapPin, Calendar } from 'lucide-react';
import { api } from '../../lib/api';

interface Project { id: string; name: string; }
interface Site { id: string; name: string; }

interface MediaItem {
  id: string;
  url?: string;
  fileUrl?: string;
  category: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

const CAT_COLORS: Record<string, string> = {
  Progress: '#22C55E',
  Delivery: '#3B82F6',
  Damage: '#EF4444',
  Incident: '#F97316',
};

export function MediaPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    api.get<Project[] | { data: Project[] }>('/projects')
      .then(r => setProjects(Array.isArray(r) ? r : (r as { data: Project[] }).data ?? []))
      .catch(console.error)
      .finally(() => setProjectsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedProject) { setSites([]); setSelectedSite(''); return; }
    api.get<Site[] | { data: Site[] }>(`/sites?projectId=${selectedProject}`)
      .then(r => {
        const list = Array.isArray(r) ? r : (r as { data: Site[] }).data ?? [];
        setSites(list);
      })
      .catch(console.error);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) { setMedia([]); return; }
    setLoading(true);
    const q = selectedSite ? `siteId=${selectedSite}` : `projectId=${selectedProject}`;
    api.get<MediaItem[] | { data: MediaItem[] }>(`/media?${q}&limit=60`)
      .then(r => setMedia(Array.isArray(r) ? r : (r as { data: MediaItem[] }).data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedSite, selectedProject]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Site Media</h1>
        <p className="text-gray-500 text-sm mt-1">Geo-tagged photos from field supervisors</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          disabled={projectsLoading}
          className="bg-[#111111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors min-w-[180px]"
        >
          <option value="">Select project…</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select
          value={selectedSite}
          onChange={e => setSelectedSite(e.target.value)}
          disabled={!selectedProject || sites.length === 0}
          className="bg-[#111111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors min-w-[180px]"
        >
          <option value="">All sites</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {!selectedProject ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-10 text-center">
          <Camera size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Select a project to view site photos</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-10 text-center">
          <Camera size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No photos uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(m => {
            const imgUrl = m.url || m.fileUrl;
            const catColor = CAT_COLORS[m.category] ?? '#F59E0B';
            return (
              <div key={m.id} className="bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden group cursor-pointer">
                <div className="aspect-square overflow-hidden bg-[#1A1A1A]">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={m.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={28} className="text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ color: catColor, background: `${catColor}18` }}
                  >
                    {m.category}
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 mt-1.5">
                    <Calendar size={10} />
                    <span className="text-xs">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  {m.latitude != null && m.longitude != null && (
                    <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                      <MapPin size={10} />
                      <span className="text-xs font-mono">{m.latitude.toFixed(3)}°, {m.longitude.toFixed(3)}°</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
