import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '' });

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setForm({ fullName: parsed.fullName || '', email: parsed.email || '' });
      } catch {
        setUser({ email: raw });
        setForm({ fullName: '', email: raw });
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const saveLocal = () => {
    // Persist only to localStorage (no backend user update endpoint available)
    const updated = { ...user, fullName: form.fullName, email: form.email };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
  };

  const activeTab = searchParams.get('tab') || 'profile';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white flex items-center justify-center text-2xl font-bold">
              {user && user.fullName ? user.fullName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.fullName || user.email || 'User'}</h2>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Profile</h3>
              <div className="space-x-2">
                {editing ? (
                  <>
                    <button onClick={() => setEditing(false)} className="px-3 py-1 border rounded text-sm">Cancel</button>
                    <button onClick={saveLocal} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Save</button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Edit profile</button>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="block">
                <div className="text-sm text-gray-600">Full name</div>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  disabled={!editing}
                  className={`mt-1 w-full px-3 py-2 border rounded ${editing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </label>

              <label className="block">
                <div className="text-sm text-gray-600">Email</div>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!editing}
                  className={`mt-1 w-full px-3 py-2 border rounded ${editing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <button onClick={logout} className="px-3 py-2 bg-red-600 text-white rounded">Log out</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
