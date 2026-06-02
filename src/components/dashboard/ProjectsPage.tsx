import { useEffect, useState } from 'react';
import { FolderOpen, Plus, Clock, MapPin, Search, X } from 'lucide-react';
import { api } from '../../lib/api';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  currency?: string;
}

interface NewProjectForm {
  name: string;
  description: string;
  location: string;
  startDate: string;
  expectedEndDate: string;
  totalBudget: string;
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: '#22c55e',
  PLANNING: '#F59E0B',
  ON_HOLD: '#f97316',
  COMPLETED: '#6b7280',
  CANCELLED: '#ef4444',
};

const EMPTY_FORM: NewProjectForm = {
  name: '',
  description: '',
  location: '',
  startDate: '',
  expectedEndDate: '',
  totalBudget: '',
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NewProjectForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  function loadProjects() {
    return api.get<Project[] | { data: Project[] }>('/projects')
      .then(r => setProjects(Array.isArray(r) ? r : (r as { data: Project[] }).data ?? []))
      .catch(console.error);
  }

  useEffect(() => {
    loadProjects().finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || p.status === filter;
    return matchSearch && matchFilter;
  });

  function openModal() {
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleField(field: keyof NewProjectForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) { setFormError('Project name is required'); return; }
    if (!form.startDate) { setFormError('Start date is required'); return; }
    if (!form.expectedEndDate) { setFormError('Expected end date is required'); return; }

    const body: Record<string, unknown> = {
      name: form.name.trim(),
      startDate: form.startDate,
      expectedEndDate: form.expectedEndDate,
    };
    if (form.description.trim()) body.description = form.description.trim();
    if (form.location.trim()) body.location = form.location.trim();
    if (form.totalBudget) body.totalBudget = Number(form.totalBudget);

    setSubmitting(true);
    try {
      await api.post('/projects', body);
      closeModal();
      await loadProjects();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} total projects</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-[#F59E0B] text-black text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#D97706] transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full bg-[#111111] border border-[#1E1E1E] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'ACTIVE', 'PLANNING', 'ON_HOLD', 'COMPLETED'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s
                  ? 'bg-[#F59E0B] text-black'
                  : 'bg-[#111111] border border-[#1E1E1E] text-gray-400 hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No projects found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5 hover:border-[#2A2A2A] transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                  <FolderOpen size={18} className="text-[#F59E0B]" />
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    color: STATUS_COLOR[p.status] ?? '#6b7280',
                    background: `${STATUS_COLOR[p.status] ?? '#6b7280'}15`,
                  }}
                >
                  {p.status?.replace('_', ' ')}
                </span>
              </div>

              <h3 className="font-semibold text-white mb-1 truncate">{p.name}</h3>
              {p.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description}</p>
              )}

              <div className="space-y-1.5 mt-3 pt-3 border-t border-[#1E1E1E]">
                {p.location && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={12} /> {p.location}
                  </div>
                )}
                {p.endDate && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} /> Due {new Date(p.endDate).toLocaleDateString()}
                  </div>
                )}
                {p.budget != null && (
                  <div className="text-xs text-[#F59E0B] font-medium">
                    Budget: {p.currency ?? 'NGN'} {p.budget.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E1E]">
              <h2 className="font-semibold text-white">New Project</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Project Name *</label>
                <input
                  value={form.name}
                  onChange={e => handleField('name', e.target.value)}
                  placeholder="e.g. Lagos Office Block"
                  className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => handleField('description', e.target.value)}
                  placeholder="Brief project overview…"
                  rows={3}
                  className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Location</label>
                <input
                  value={form.location}
                  onChange={e => handleField('location', e.target.value)}
                  placeholder="e.g. Victoria Island, Lagos"
                  className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Start Date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => handleField('startDate', e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Expected End Date *</label>
                  <input
                    type="date"
                    value={form.expectedEndDate}
                    onChange={e => handleField('expectedEndDate', e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Total Budget (NGN)</label>
                <input
                  type="number"
                  min="0"
                  value={form.totalBudget}
                  onChange={e => handleField('totalBudget', e.target.value)}
                  placeholder="e.g. 5000000"
                  className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-400">{formError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-[#F59E0B] text-black text-sm font-bold rounded-xl hover:bg-[#D97706] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating…' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
