import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

interface FinancialEntry {
  id: string;
  projectId: string;
  type: 'BUDGET_ALLOCATION' | 'EXPENDITURE' | 'PAYMENT' | 'INVOICE' | 'ADJUSTMENT' | 'REFUND';
  amount: number;
  currency: string;
  description: string;
  category?: string;
  date: string;
}

interface Project {
  id: string;
  name: string;
}

const INCOME_TYPES = new Set(['BUDGET_ALLOCATION', 'INVOICE', 'REFUND']);
const EXPENSE_TYPES = new Set(['EXPENDITURE', 'PAYMENT', 'ADJUSTMENT']);

export function FinancialsPage() {
  const [entries, setEntries] = useState<(FinancialEntry & { projectName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Project[] | { data: Project[] }>('/projects')
      .then(async r => {
        const projects = Array.isArray(r) ? r : (r as { data: Project[] }).data ?? [];
        const results = await Promise.allSettled(
          projects.slice(0, 10).map(p =>
            api.get<FinancialEntry[]>(`/financial/project/${p.id}`)
              .then(fe => {
                const list = Array.isArray(fe) ? fe : [];
                return list.map(e => ({ ...e, projectName: p.name }));
              })
          )
        );
        const all = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
        all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(all);
      })
      .catch(() => setError('No financial data available yet'))
      .finally(() => setLoading(false));
  }, []);

  const income = entries.filter(e => INCOME_TYPES.has(e.type)).reduce((s, e) => s + e.amount, 0);
  const expenses = entries.filter(e => EXPENSE_TYPES.has(e.type)).reduce((s, e) => s + e.amount, 0);
  const balance = income - expenses;

  function fmt(n: number) {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Financials</h1>
        <p className="text-gray-500 text-sm mt-1">Budget tracking across all projects</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[#22c55e]" />
            <span className="text-xs text-gray-400">Total Income</span>
          </div>
          <p className="text-xl font-bold text-white">{fmt(income)}</p>
        </div>
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-[#ef4444]" />
            <span className="text-xs text-gray-400">Total Expenses</span>
          </div>
          <p className="text-xl font-bold text-white">{fmt(expenses)}</p>
        </div>
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[#F59E0B]" />
            <span className="text-xs text-gray-400">Net Balance</span>
          </div>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{fmt(balance)}</p>
        </div>
      </div>

      {/* Entries table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error || entries.length === 0 ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-10 text-center">
          <AlertCircle size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{error || 'No financial records yet'}</p>
          <p className="text-gray-600 text-xs mt-1">Budget entries will appear here once added to a project</p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1E1E1E]">
            <h2 className="font-semibold text-white text-sm">All Transactions</h2>
          </div>
          <div className="divide-y divide-[#1E1E1E]">
            {entries.map(e => {
              const isIncome = INCOME_TYPES.has(e.type);
              return (
                <div key={e.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isIncome ? 'bg-[#22c55e]/10' : 'bg-[#ef4444]/10'
                  }`}>
                    {isIncome
                      ? <TrendingUp size={14} className="text-[#22c55e]" />
                      : <TrendingDown size={14} className="text-[#ef4444]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{e.description}</p>
                    <p className="text-xs text-gray-500">
                      {e.type.replace('_', ' ')}
                      {e.projectName ? ` · ${e.projectName}` : ''}
                      {e.date ? ` · ${new Date(e.date).toLocaleDateString()}` : ''}
                    </p>
                  </div>
                  <p className={`text-sm font-semibold ${isIncome ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {isIncome ? '+' : '-'}{fmt(e.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
