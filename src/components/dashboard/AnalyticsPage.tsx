import { useEffect, useState } from 'react';
import { BarChart2, AlertTriangle } from 'lucide-react';
import { api } from '../../lib/api';

interface RiskFactor {
  factor: string;
  description: string;
}

interface Prediction {
  riskScore: number;
  severity: string;
  factors: RiskFactor[];
  prediction: string;
  suggestions: string[];
  createdAt: string;
}

interface ProjectRisk {
  project: { id: string; name: string };
  latestPrediction: Prediction | null;
}

function severityStyle(s: string) {
  if (s === 'CRITICAL' || s === 'HIGH') return { color: '#EF4444', bg: '#EF444412', border: '#EF444420' };
  if (s === 'MEDIUM') return { color: '#F59E0B', bg: '#F59E0B12', border: '#F59E0B20' };
  return { color: '#22C55E', bg: '#22C55E12', border: '#22C55E20' };
}

export function AnalyticsPage() {
  const [data, setData] = useState<ProjectRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<{ data: ProjectRisk[] } | ProjectRisk[]>('/analytics/risk-overview')
      .then(r => setData(Array.isArray(r) ? r : (r as { data: ProjectRisk[] }).data ?? []))
      .catch(e => setError(e.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const withPred = data.filter(d => d.latestPrediction != null);
  const avgRisk = withPred.length > 0
    ? Math.round(withPred.reduce((s, d) => s + d.latestPrediction!.riskScore, 0) / withPred.length)
    : null;
  const highRisk = withPred.filter(d =>
    d.latestPrediction!.severity === 'HIGH' || d.latestPrediction!.severity === 'CRITICAL'
  ).length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & AI Insights</h1>
        <p className="text-gray-500 text-sm mt-1">AI-powered risk scores and delay predictions across all projects</p>
      </div>

      {error ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-10 text-center">
          <BarChart2 size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-10 text-center">
          <BarChart2 size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No analytics data yet. Add projects and activity to generate insights.</p>
        </div>
      ) : (
        <>
          {avgRisk != null && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Projects tracked', value: data.length, color: '#fff' },
                { label: 'Avg risk score', value: avgRisk, color: '#F59E0B' },
                { label: 'High-risk projects', value: highRisk, color: '#EF4444' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
                  <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {data.map(({ project, latestPrediction: pred }) => {
              const style = pred ? severityStyle(pred.severity) : severityStyle('LOW');
              return (
                <div key={project.id} className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-base">{project.name}</h3>
                      {pred && (
                        <span
                          className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-semibold mt-1.5"
                          style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
                        >
                          {pred.severity} RISK
                        </span>
                      )}
                    </div>
                    {pred && (
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-3xl font-bold text-white leading-none">{pred.riskScore}</p>
                        <p className="text-xs text-gray-500 mt-1">risk score</p>
                      </div>
                    )}
                  </div>

                  {!pred ? (
                    <p className="text-sm text-gray-500 italic">No AI prediction yet — needs more activity data</p>
                  ) : (
                    <>
                      {pred.prediction && (
                        <div className="bg-[#F59E0B]/8 border border-[#F59E0B]/15 rounded-xl p-3 mb-3 flex gap-2">
                          <AlertTriangle size={14} className="text-[#F59E0B] shrink-0 mt-0.5" />
                          <p className="text-sm text-[#F59E0B]">{pred.prediction}</p>
                        </div>
                      )}

                      {pred.factors.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Risk Factors</p>
                          <div className="space-y-1.5">
                            {pred.factors.slice(0, 4).map((f, i) => (
                              <div key={i} className="flex gap-2.5 items-baseline">
                                <div className="w-1 h-1 rounded-full bg-red-400 shrink-0 mt-1.5" />
                                <span className="text-xs font-medium text-gray-300">{f.factor.replace(/_/g, ' ')}</span>
                                {f.description && <span className="text-xs text-gray-500">— {f.description}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {pred.suggestions.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Suggested Actions</p>
                          <div className="flex flex-wrap gap-2">
                            {pred.suggestions.slice(0, 5).map((s, i) => (
                              <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#1A1A1A] text-gray-300 border border-[#2A2A2A]">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
