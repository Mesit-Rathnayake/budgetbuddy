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
      try {
        const parsed = JSON.parse(u);
        setUsername(parsed.fullName || parsed.email || 'User');
      } catch {
        setUsername(u);
      }
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
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/home')}
              className="text-2xl font-extrabold text-green-600 mr-6 hover:scale-[1.02] transition-transform"
            >
              Budget<span className="text-blue-600">Buddy</span>
            </button>

            <nav className="hidden md:flex space-x-2">
              {[
                { to: '/home', label: 'Home' },
                { to: '/track', label: 'Track Expenses' },
                { to: '/reports', label: 'Visual Reports' },
                { to: '/goals', label: 'Goals' },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Search + Profile + Menu */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden sm:block">
              <input
                type="search"
                placeholder="Search transactions..."
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label="Search transactions"
              />
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center font-semibold shadow-sm">
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {username || 'User'}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 animate-fadeIn">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/profile');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/profile?tab=settings');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition"
                  >
                    Settings
                  </button>
                  <div className="border-t my-1" />
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    open
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm animate-slideDown">
          <nav className="px-3 pt-3 pb-4 space-y-1">
            {[
              { to: '/home', label: 'Home' },
              { to: '/track', label: 'Track Expenses' },
              { to: '/reports', label: 'Visual Reports' },
              { to: '/goals', label: 'Goals' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
