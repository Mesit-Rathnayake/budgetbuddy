import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import SignUpPage from './pages/SignUpPage';
import reportWebVitals from './reportWebVitals';
import logoPng from './logo.png';
import HomePage from './pages/HomePage.js';
import TrackExpensesPage from './pages/TrackExpensesPage';
import VisualReportPage from './pages/VisualReportPage';
import SetGoalsPage from './pages/SetGoalsPage';
import ProfilePage from './pages/ProfilePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/track" element={<TrackExpensesPage/>} />
        <Route path="/reports" element={<VisualReportPage/>} />
        <Route path="/goals" element={<SetGoalsPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// replace default favicon with imported logo from src so the bundled asset is used
try {
  const setFavicon = (href) => {
    const existing = document.querySelector("link[rel~='icon']");
    if (existing) existing.href = href;
    else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = href;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  };
  if (logoPng) setFavicon(logoPng);
} catch (e) {
  // ignore in environments where document is not available
}


reportWebVitals();
