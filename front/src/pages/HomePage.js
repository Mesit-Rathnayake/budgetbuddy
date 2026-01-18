import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, BarChart3, Target, TrendingUp, Flag, Calendar } from 'lucide-react'; // ✅ Icons
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomePage() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('USD');

  const navigate = useNavigate();

  const handleTrackExpenses = () => navigate('/track');
  const handleVisualReport = () => navigate('/reports');
  const handleSetGoals = () => navigate('/goals');

  const computeSummaryFrom = (txs = [], goals = []) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const lmStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lmEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    let expensesThisMonth = 0;
    let lastMonthExpenses = 0;

    txs.forEach(t => {
      const d = new Date(t.date);
      if (t.type === 'expense') {
        if (d >= start && d <= now) expensesThisMonth += Number(t.amount || 0);
        if (d >= lmStart && d <= lmEnd) lastMonthExpenses += Number(t.amount || 0);
      }
    });

    let recentChange = null;
    if (lastMonthExpenses === 0) recentChange = expensesThisMonth === 0 ? 0 : 100;
    else recentChange = Math.round(((expensesThisMonth - lastMonthExpenses) / lastMonthExpenses) * 100);

    const activeGoals = goals.length;
    let achievedGoals = 0;
    goals.forEach(g => {
      const goalCreatedAt = g.createdAt ? new Date(g.createdAt) : new Date(0);
      const relevant = txs.filter(t => new Date(t.date) >= goalCreatedAt);
      let sum = 0;
      if (g.type === 'save') {
        sum = relevant.reduce((acc, t) => acc + ((t.type === 'income' && (!g.category || t.category === g.category)) ? Number(t.amount || 0) : 0), 0);
        if (sum >= (g.targetAmount || 0)) achievedGoals += 1;
      } else {
        sum = relevant.reduce((acc, t) => acc + ((t.type === 'expense' && (!g.category || t.category === g.category)) ? Number(t.amount || 0) : 0), 0);
        if (sum <= (g.targetAmount || 0)) achievedGoals += 1;
      }
    });

    return { expensesThisMonth, recentChange, activeGoals, achievedGoals };
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSummary(null);
        setRecent([]);
        return;
      }

      const [rTx, rGoals, rCurrency] = await Promise.all([
        fetch('/api/transactions', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/goals', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/settings/currency', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (!rTx.ok) throw new Error('Failed to load transactions');
      if (!rGoals.ok) throw new Error('Failed to load goals');
      if (rCurrency && rCurrency.ok) {
        try {
          const c = await rCurrency.json();
          if (c && c.currency) setCurrency(c.currency);
        } catch (e) {
          // ignore currency parse errors, keep default
        }
      }

      const txs = await rTx.json();
      const goals = await rGoals.json();

      setRecent(txs.slice(0, 5));
      setSummary(computeSummaryFrom(txs, goals));
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Dashboard</h1>

            {/* 🌈 Modernized Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Track Expenses */}
              <button
                type="button"
                onClick={handleTrackExpenses}
                className="col-span-1 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center gap-3"
              >
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-semibold">T Expenses</div>
                <div className="text-sm text-indigo-100">Quickly add income & expenses</div>
              </button>

              {/* Visual Reports */}
              <button
                type="button"
                onClick={handleVisualReport}
                className="col-span-1 bg-gradient-to-br from-emerald-500 to-green-600 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center gap-3"
              >
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-semibold">Visual Reports</div>
                <div className="text-sm text-green-100">Charts and spending trends</div>
              </button>

              {/* Set Goals */}
              <button
                type="button"
                onClick={handleSetGoals}
                className="col-span-1 bg-gradient-to-br from-amber-400 to-yellow-500 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center gap-3"
              >
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-semibold">Set Goals</div>
                <div className="text-sm text-yellow-100">Create and track savings goals</div>
              </button>
            </div>
          </div>

          {error && <div className="mb-4 text-red-600">{error}</div>}

          {/* 📊 Updated Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Expenses This Month */}
            <div className="relative bg-white p-5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-t-4 border-indigo-500">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-gray-600">This Month (Expenses)</span>
              </div>
              <div className="text-3xl font-bold mt-3 text-gray-800">
                {summary ? summary.expensesThisMonth.toFixed(2) : loading ? 'Loading...' : '—'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Currency: {currency || 'USD'}
              </div>
            </div>

            {/* Recent Change */}
            <div className="relative bg-white p-5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-t-4 border-emerald-500">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-600">Recent Change</span>
              </div>
              <div
                className={`text-3xl font-bold mt-3 ${
                  summary && summary.recentChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {summary
                  ? summary.recentChange >= 0
                    ? `+${summary.recentChange}%`
                    : `${summary.recentChange}%`
                  : loading
                  ? 'Loading...'
                  : '—'}
              </div>
              <div className="text-xs text-gray-500 mt-1">vs last month</div>
            </div>

            {/* Goals */}
            <div className="relative bg-white p-5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-t-4 border-amber-400">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-gray-600">Goals</span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mt-3">
                {summary ? `${summary.activeGoals} active` : loading ? 'Loading...' : '—'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {summary ? `${summary.achievedGoals} achieved` : ''}
              </div>
            </div>
          </section>

          {/* 💰 Recent Transactions */}
          <section className="mt-6 w-full">
            <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
            {recent.length === 0 ? (
              <div className="text-gray-500">No recent transactions. Log in and add some!</div>
            ) : (
              <ul className="space-y-2">
                {recent.map(tx => (
                  <li
                    key={tx._id}
                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200"
                  >
                    <div>
                      <div className="font-medium">
                        {tx.category || '—'} • {tx.note || ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className={
                        tx.type === 'income'
                          ? 'text-green-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {tx.type === 'income'
                        ? `+${Number(tx.amount).toFixed(2)}`
                        : `-${Number(tx.amount).toFixed(2)}`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
