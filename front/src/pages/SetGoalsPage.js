import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SetGoalsPage() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('save');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/goals', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to load goals');
      const data = await res.json();
      setGoals(data || []);
    } catch (err) {
      console.error(err);
      setError('Could not load goals');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setType('save');
    setTargetAmount('');
    setCategory('');
    setDueDate('');
    setEditingId(null);
  };

  const saveGoal = async () => {
    setError(null);
    if (!title || !targetAmount)
      return setError('Please provide a title and target amount');
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title,
        type,
        targetAmount: Number(targetAmount),
        category,
        dueDate: dueDate || null,
      };
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = editingId
        ? await fetch(`/api/goals/${editingId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload),
          })
        : await fetch('/api/goals', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
          });
      if (!res.ok) throw new Error('Save failed');
      await loadGoals();
      resetForm();
    } catch (err) {
      console.error(err);
      setError('Failed to save goal');
    }
  };

  const editGoal = (g) => {
    setEditingId(g._id);
    setTitle(g.title || '');
    setType(g.type || 'save');
    setTargetAmount(g.targetAmount ? String(g.targetAmount) : '');
    setCategory(g.category || '');
    setDueDate(g.dueDate ? new Date(g.dueDate).toISOString().slice(0, 10) : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteGoal = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Delete failed');
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header />
      <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🎯 Set Goals</h1>
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium hover:bg-gray-200 transition"
            >
              ⬅ Back to Home
            </button>
          </div>

          <div className="mb-8 p-5 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white">
            <h2 className="font-semibold text-lg mb-3">
              {editingId ? '✏️ Edit Goal' : '➕ Create a New Goal'}
            </h2>
            {error && <div className="text-red-600 mb-3">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Goal Title"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="save">Save</option>
                <option value="spend">Reduce Spending</option>
              </select>

              <input
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Target Amount"
                type="number"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category (optional)"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                type="date"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

              <div className="sm:col-span-2 text-right mt-2">
                <button
                  onClick={saveGoal}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all mr-2"
                >
                  {editingId ? '💾 Save Changes' : '✅ Create Goal'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-4">📋 Your Goals</h2>
            {loading ? (
              <div>Loading...</div>
            ) : goals.length === 0 ? (
              <div className="text-gray-600 italic">No goals yet. Start by adding one above!</div>
            ) : (
              <div className="grid gap-4">
                {goals.map((g) => (
                  <div
                    key={g._id}
                    className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-lg text-gray-800">
                        {g.title}{' '}
                        <span className="text-sm text-gray-500">({g.type})</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        🎯 Target: <span className="font-medium">{g.targetAmount}</span>{' '}
                        {g.category && (
                          <span className="ml-2">• Category: {g.category}</span>
                        )}
                        {g.dueDate && (
                          <span className="ml-2">
                            • Due: {new Date(g.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editGoal(g)}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteGoal(g._id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
