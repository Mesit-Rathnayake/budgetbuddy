import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function HomePage() {
  // Summary data; initial null while loading.
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleTrackExpenses = () => {
    // Navigate to the Track Expenses dummy page
    navigate('/track');
  };

  const handleVisualReport = () => {
    // Navigate to the Visual Reports dummy page
    navigate('/reports');
  };

  const handleSetGoals = () => {
    // Navigate to the Set Goals dummy page
    navigate('/goals');
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/summary');

        if (!res.ok) {
          // Try to read the body for more context
          const body = await res.text().catch(() => '<no body>');
          throw new Error(`Failed to fetch summary: ${res.status} ${res.statusText} - ${body.substring(0,200)}`);
        }

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          // Received HTML or other unexpected response (common when proxy/backend not running)
          const text = await res.text().catch(() => '<no body>');
          throw new Error(`Expected JSON but received: ${text.substring(0,200)}`);
        }

        const data = await res.json();
        if (mounted) setSummary(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-start">
      <Header />
      <main className="w-full max-w-4xl p-6">
        <div className="w-full max-w-4xl mt-6 mb-8 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">Budget Buddy</h1>
          <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto">
            Take control of your finances with our simple and effective budget tracking tool.
          </p>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="text-green-600 text-3xl mb-4">💰</div>
            <h3 className="font-semibold text-lg mb-2">Track Expenses</h3>
            <p className="text-gray-600 mb-4">Monitor your spending habits and identify areas to save.</p>
            <button
              onClick={handleTrackExpenses}
              className="mt-auto inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Open Tracker
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="text-green-600 text-3xl mb-4">📊</div>
            <h3 className="font-semibold text-lg mb-2">Visual Reports</h3>
            <p className="text-gray-600 mb-4">See your financial data in easy-to-understand charts.</p>
            <button
              onClick={handleVisualReport}
              className="mt-auto inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              View Reports
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="text-green-600 text-3xl mb-4">🎯</div>
            <h3 className="font-semibold text-lg mb-2">Set Goals</h3>
            <p className="text-gray-600 mb-4">Create and achieve your financial targets.</p>
            <button
              onClick={handleSetGoals}
              className="mt-auto inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Create Goal
            </button>
          </div>
        </section>

        {/* Small summary widgets */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading && (
            <div className="col-span-full text-center text-gray-500">Loading summary…</div>
          )}

          {error && (
            <div className="col-span-full text-center text-red-500">Error: {error}</div>
          )}

          {!loading && summary && (
            <>
              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
                <div className="text-sm text-gray-500">This month</div>
                <div className="text-2xl font-bold text-gray-800 mt-2">${summary.expensesThisMonth.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Total expenses</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
                <div className="text-sm text-gray-500">Recent change</div>
                <div className={`text-2xl font-bold mt-2 ${summary.recentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.recentChange >= 0 ? `+${summary.recentChange}%` : `${summary.recentChange}%`}
                </div>
                <div className="text-xs text-gray-500 mt-1">vs last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
                <div className="text-sm text-gray-500">Goals</div>
                <div className="text-2xl font-bold text-gray-800 mt-2">{summary.activeGoals} active</div>
                <div className="text-xs text-gray-500 mt-1">{summary.achievedGoals} achieved</div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}