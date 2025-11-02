import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import SignUpPage from './pages/SignUpPage';
import reportWebVitals from './reportWebVitals';
import HomePage from './pages/HomePage.js';
import TrackExpensesPage from './pages/TrackExpensesPage';
import VisualReportPage from './pages/VisualReportPage';
import SetGoalsPage from './pages/SetGoalsPage';

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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
