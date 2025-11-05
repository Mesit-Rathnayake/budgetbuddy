import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Small, dependency-free visual reports page using SVG for charts
export default function VisualReportPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all'); // all / income / expense
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
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

  // Filter transactions by date and type
  const filtered = useMemo(() => {
    let list = transactions.slice();
    if (typeFilter === 'income' || typeFilter === 'expense') {
      list = list.filter(t => t.type === typeFilter);
    }
    if (startDate) {
      const s = new Date(startDate);
      list = list.filter(t => new Date(t.date) >= s);
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      list = list.filter(t => new Date(t.date) <= e);
    }
    return list;
  }, [transactions, typeFilter, startDate, endDate]);

  // Aggregate by category for the bar chart (expenses positive numbers)
  const aggByCategory = useMemo(() => {
    const map = new Map();
    filtered.forEach(t => {
      const key = t.category || 'Uncategorized';
      const v = Number(t.amount || 0);
      // For visual clarity, show income as positive, expense as positive but mark color later
      map.set(key, (map.get(key) || 0) + v);
    });
    // Convert to sorted array desc
    return Array.from(map.entries()).map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const totals = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const t = filtered.reduce((acc, tr) => {
      const d = new Date(tr.date);
      if (d >= start && d <= now) {
        if (tr.type === 'income') acc.income += Number(tr.amount || 0);
        else acc.expense += Number(tr.amount || 0);
      }
      return acc;
    }, { income: 0, expense: 0 });
    t.balance = t.income - t.expense;
    return t;
  }, [filtered]);

  const downloadCSV = () => {
    const headers = ['type', 'amount', 'category', 'date', 'note'];
    const rows = filtered.map(t => [t.type, t.amount, `"${(t.category||'').replace(/"/g,'""')}"`, new Date(t.date).toISOString(), `"${(t.note||'').replace(/"/g,'""')}"`]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
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

  // Simple SVG horizontal bar chart
  const BarChart = ({ data, width = 700, barHeight = 24, gap = 8 }) => {
    if (!data || data.length === 0) return <div className="text-gray-600">No data to chart</div>;
    const max = Math.max(...data.map(d => d.value));
    const height = data.length * (barHeight + gap);
    return (
      <svg width={width} height={height} className="w-full">
        {data.map((d, i) => {
          const y = i * (barHeight + gap);
          const barW = max === 0 ? 0 : Math.round((d.value / max) * (width - 160));
          return (
            <g key={d.category} transform={`translate(0, ${y})`}>
              <text x={0} y={barHeight/2+4} className="text-sm fill-gray-700">{d.category}</text>
              <rect x={140} y={0} width={barW} height={barHeight} rx={4} fill="#60A5FA" />
              <text x={150+barW} y={barHeight/2+4} className="text-sm fill-gray-700">{d.value.toFixed(2)}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Header />
      <main className="p-6 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Visual Reports</h1>
            <div className="flex gap-2">
              <button onClick={() => navigate('/home')} className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200">Back to Home</button>
              <button onClick={downloadCSV} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Export CSV</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-3 border rounded">
              <div className="text-sm text-gray-600">Filter</div>
              <div className="mt-2 flex flex-col gap-2">
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="p-2 border rounded">
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded" />
                <button onClick={() => { setStartDate(''); setEndDate(''); setTypeFilter('all'); }} className="mt-2 text-sm text-gray-600 underline">Clear filters</button>
              </div>
            </div>

            <div className="p-3 border rounded lg:col-span-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Totals (filtered)</div>
                  <div className="text-2xl font-bold">Income: <span className="text-green-600">{totals.income.toFixed(2)}</span> — Expenses: <span className="text-red-600">{totals.expense.toFixed(2)}</span></div>
                  <div className="text-sm text-gray-600">Balance: <strong>{totals.balance.toFixed(2)}</strong></div>
                </div>
              </div>
              <div className="mt-4">
                {loading ? <div>Loading chart...</div> : <BarChart data={aggByCategory} />}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Recent Transactions (filtered)</h2>
            {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> : (
              <div className="space-y-2">
                {filtered.slice(0, 20).map(tx => (
                  <div key={tx._id} className="p-3 border rounded flex justify-between items-center">
                    <div>
                      <div className="font-medium">{tx.category} — <span className={tx.type==='income'? 'text-green-600' : 'text-red-600'}>{tx.type}</span></div>
                      <div className="text-sm text-gray-500">{new Date(tx.date).toLocaleString()} {tx.note ? `• ${tx.note}` : ''}</div>
                    </div>
                    <div className="text-right">
                      <div className={tx.type==='income'? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{Number(tx.amount).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && <div className="text-gray-600">No transactions found.</div>}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
