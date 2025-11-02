import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      try { setUsername(JSON.parse(u).fullName || JSON.parse(u).email); } catch { setUsername(u); }
    }

    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button className="text-2xl font-extrabold text-green-600 mr-4" onClick={() => navigate('/home')}>BudgetBuddy</button>
            <nav className="hidden md:flex space-x-2">
              <NavLink to="/home" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                Home
              </NavLink>
              <NavLink to="/track" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                Track Expenses
              </NavLink>
              <NavLink to="/reports" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                Visual Reports
              </NavLink>
              <NavLink to="/goals" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                Goals
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <input
                type="search"
                placeholder="Search transactions..."
                className="px-3 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Search transactions"
              />
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-50">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">{username ? username.charAt(0).toUpperCase() : 'U'}</div>
                <span className="hidden sm:block text-sm text-gray-700">{username || 'User'}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                  <button onClick={() => { setProfileOpen(false); navigate('/home'); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Profile</button>
                  <button onClick={() => { setProfileOpen(false); navigate('/home'); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Settings</button>
                  <div className="border-t" />
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Log out</button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setOpen(!open)} className="p-2 rounded-md hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/home" className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>Home</NavLink>
            <NavLink to="/track" className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>Track Expenses</NavLink>
            <NavLink to="/reports" className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>Visual Reports</NavLink>
            <NavLink to="/goals" className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>Goals</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
