import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const currencySymbols = {
  USD: '$',
  EUR: '',
  GBP: '',
  INR: '',
  LKR: 'Rs',
  JPY: ''
};

export default function TrackExpensesPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [savingCurrency, setSavingCurrency] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchCurrency();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to load expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError('Could not load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrency = async () => {
    try {
      const res = await fetch('/api/settings/currency');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.currency) setCurrency(data.currency);
    } catch (err) {
      console.error('Failed to fetch currency', err);
    }
  };

  const addExpense = async () => {
    setError(null);
    if (!amount || !category || !date) return setError('Please fill amount, category and date');
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), category, date, note })
      });
      if (!res.ok) throw new Error('Add failed');
      const created = await res.json();
      setExpenses(prev => [created, ...prev]);
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().slice(0, 10));
      setNote('');
    } catch (err) {
      console.error(err);
      setError('Failed to add expense');
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setExpenses(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete');
    }
  };

  const saveCurrency = async (newCurrency) => {
    setSavingCurrency(true);
    try {
      const res = await fetch('/api/settings/currency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: newCurrency })
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      if (data && data.currency) setCurrency(data.currency);
    } catch (err) {
      console.error(err);
      setError('Failed to save currency');
    } finally {
      setSavingCurrency(false);
    }
  };

  const totalThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const sum = expenses.reduce((acc, e) => {
      const d = new Date(e.date);
      if (d >= start && d <= now) return acc + Number(e.amount || 0);
      return acc;
    }, 0);
    return sum;
  };

  const symbol = currencySymbols[currency] || currency;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Header />
      <main className="p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Track Expenses</h1>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Currency</label>
              <select
                value={currency}
                onChange={(e) => saveCurrency(e.target.value)}
                className="p-2 border rounded"
                aria-label="Select currency"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
                <option value="LKR">LKR</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <section className="p-4 border rounded">
              <h2 className="font-semibold mb-2">Add Expense</h2>
              {error && <div className="text-red-600 mb-2">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" type="number" className="p-2 border rounded" />
                <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" type="text" className="p-2 border rounded" />
                <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date" type="date" className="p-2 border rounded" />
                <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" type="text" className="p-2 border rounded" />
                <div className="sm:col-span-2 text-right">
                  <button type="button" onClick={addExpense} className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
                </div>
              </div>
            </section>

            <section className="p-4 border rounded">
              <h2 className="font-semibold mb-2">Summary</h2>
              <div className="text-xl font-bold">{symbol}{totalThisMonth().toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total this month</div>
              <div className="mt-4">
                <div className="text-sm">Expenses recorded: <strong>{expenses.length}</strong></div>
              </div>
            </section>
          </div>

          <section>
            <h2 className="font-semibold mb-3">Recent Expenses</h2>
            {loading ? (
              <div>Loading...</div>
            ) : expenses.length === 0 ? (
              <div className="text-gray-600">No expenses yet.</div>
            ) : (
              <ul className="space-y-3">
                {expenses.map(exp => (
                  <li key={exp._id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{exp.category} - {symbol}{Number(exp.amount).toFixed(2)}</div>
                      <div className="text-sm text-gray-500">{new Date(exp.date).toLocaleDateString()} {exp.note ? ` ${exp.note}` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteExpense(exp._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="mt-6 text-right">
            <button onClick={() => navigate('/home')} className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200">Back to Home</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
