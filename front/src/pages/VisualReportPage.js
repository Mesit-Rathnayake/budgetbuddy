import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Download, ArrowLeft, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function VisualReportPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/transactions', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to load transactions');
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      setError('Could not load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = transactions.slice();
    if (typeFilter === 'income' || typeFilter === 'expense') {
      list = list.filter((t) => t.type === typeFilter);
    }
    if (startDate) {
      const s = new Date(startDate);
      list = list.filter((t) => new Date(t.date) >= s);
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      list = list.filter((t) => new Date(t.date) <= e);
    }
    return list;
  }, [transactions, typeFilter, startDate, endDate]);

  const aggByCategory = useMemo(() => {
    const map = new Map();
    filtered.forEach((t) => {
      const key = t.category || 'Uncategorized';
      const v = Number(t.amount || 0);
      map.set(key, (map.get(key) || 0) + v);
    });
    return Array.from(map.entries())
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const totals = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const t = filtered.reduce(
      (acc, tr) => {
        const d = new Date(tr.date);
        if (d >= start && d <= now) {
          if (tr.type === 'income') acc.income += Number(tr.amount || 0);
          else acc.expense += Number(tr.amount || 0);
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
    t.balance = t.income - t.expense;
    return t;
  }, [filtered]);

  const downloadCSV = () => {
    const headers = ['type', 'amount', 'category', 'date', 'note'];
    const rows = filtered.map((t) => [
      t.type,
      t.amount,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      new Date(t.date).toISOString(),
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const BarChart = ({ data, width = 700, barHeight = 24, gap = 8 }) => {
    if (!data || data.length === 0)
      return <div className="text-gray-500 text-center py-4">No data to chart</div>;
    const max = Math.max(...data.map((d) => d.value));
    const height = data.length * (barHeight + gap);
    return (
      <svg width={width} height={height} className="w-full">
        {data.map((d, i) => {
          const y = i * (barHeight + gap);
          const barW = max === 0 ? 0 : Math.round((d.value / max) * (width - 160));
          return (
            <g key={d.category} transform={`translate(0, ${y})`}>
              <text x={0} y={barHeight / 2 + 4} className="text-sm fill-gray-700">
                {d.category}
              </text>
              <rect
                x={140}
                y={0}
                width={barW}
                height={barHeight}
                rx={4}
                fill="#60A5FA"
                className="transition-all duration-300 hover:fill-blue-500"
              />
              <text
                x={150 + barW}
                y={barHeight / 2 + 4}
                className="text-sm fill-gray-700"
              >
                {d.value.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 flex flex-col">
      <Header />
      <main className="p-6 max-w-6xl mx-auto w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full border border-gray-100">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
              <BarChart3 className="w-7 h-7 text-blue-600" />
              Visual Reports
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition-all"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          {/* Filters + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Filters */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
                <Filter className="w-4 h-4" /> Filters
              </div>
              <div className="flex flex-col gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setTypeFilter('all');
                  }}
                  className="mt-1 text-sm text-gray-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm lg:col-span-2">
              <div className="text-sm text-gray-600 mb-1">Totals (Filtered)</div>
              <div className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Income: <span className="text-green-600">{totals.income.toFixed(2)}</span>
                </div>
                <span>—</span>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  Expense: <span className="text-red-600">{totals.expense.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                Balance:{' '}
                <strong
                  className={`${
                    totals.balance >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {totals.balance.toFixed(2)}
                </strong>
              </div>
              <div className="mt-5">
                {loading ? (
                  <div className="text-gray-500">Loading chart...</div>
                ) : (
                  <BarChart data={aggByCategory} />
                )}
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Recent Transactions (Filtered)
            </h2>
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <div className="space-y-2">
                {filtered.slice(0, 20).map((tx) => (
                  <div
                    key={tx._id}
                    className="p-3 rounded-xl border border-gray-200 shadow-sm bg-white flex justify-between items-center hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="font-medium text-gray-800">
                        {tx.category} —{' '}
                        <span
                          className={
                            tx.type === 'income'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {tx.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(tx.date).toLocaleString()}{' '}
                        {tx.note ? `• ${tx.note}` : ''}
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {Number(tx.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-gray-600 text-center py-3">
                    No transactions found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
