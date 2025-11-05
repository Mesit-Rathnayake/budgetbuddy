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
  const [transactions, setTransactions] = useState([]);
  const [txType, setTxType] = useState('expense');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [savingCurrency, setSavingCurrency] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchCurrency();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/transactions', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Failed to load transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
      setError('Could not load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrency = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/settings/currency', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.currency) setCurrency(data.currency);
    } catch (err) {
      console.error('Failed to fetch currency', err);
    }
  };

  const addTransaction = async () => {
    setError(null);
    if (!amount || !category || !date) return setError('Please fill amount, category and date');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ type: txType, amount: Number(amount), category, date, note })
      });
      if (!res.ok) throw new Error('Add failed');
      const created = await res.json();
      setTransactions(prev => [created, ...prev]);
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().slice(0, 10));
      setNote('');
    } catch (err) {
      console.error(err);
      setError('Failed to add transaction');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Delete failed');
      setTransactions(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete');
    }
  };

  const saveCurrency = async (newCurrency) => {
    setSavingCurrency(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/settings/currency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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

  const totalsThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return transactions.reduce(
      (acc, t) => {
        const d = new Date(t.date);
        if (d >= start && d <= now) {
          if (t.type === 'income') acc.income += Number(t.amount || 0);
          else acc.expense += Number(t.amount || 0);
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  };

  const symbol = currencySymbols[currency] || currency;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Header />
      <main className="p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Track Transactions</h1>
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
              <h2 className="font-semibold mb-2">Add Transaction</h2>
              {error && <div className="text-red-600 mb-2">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={txType} onChange={e => setTxType(e.target.value)} className="p-2 border rounded">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" type="number" className="p-2 border rounded" />
                <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" type="text" className="p-2 border rounded" />
                <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date" type="date" className="p-2 border rounded" />
                <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" type="text" className="p-2 border rounded" />
                <div className="sm:col-span-2 text-right">
                  <button type="button" onClick={addTransaction} className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
                </div>
              </div>
            </section>

            <section className="p-4 border rounded">
              <h2 className="font-semibold mb-2">Summary</h2>
              {(() => {
                const t = totalsThisMonth();
                const balance = t.income - t.expense;
                return (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{symbol}{t.income.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Income (this month)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{symbol}{t.expense.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Expenses (this month)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{symbol}{balance.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Balance</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm">Transactions recorded: <strong>{transactions.length}</strong></div>
                    </div>
                  </>
                );
              })()}
            </section>
          </div>

          <section>
            <h2 className="font-semibold mb-3">Recent Transactions</h2>
            {loading ? (
              <div>Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="text-gray-600">No transactions yet.</div>
            ) : (
              <ul className="space-y-3">
                {transactions.map(tx => (
                  <li key={tx._id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{tx.category} - {tx.type === 'income' ? <span className="text-green-600">{symbol}{Number(tx.amount).toFixed(2)}</span> : <span className="text-red-600">{symbol}{Number(tx.amount).toFixed(2)}</span>}</div>
                      <div className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()} {tx.note ? ` • ${tx.note}` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteTransaction(tx._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
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
