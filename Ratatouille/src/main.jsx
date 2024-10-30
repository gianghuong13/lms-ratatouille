import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage.jsx';
import MePage from './pages/MePage.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="index" replace />} />
        <Route path="/index" element={<LoginPage />} />
        <Route path="/admin" element={<MePage />} />
        <Route path="/teacher" element={<MePage />} />
        <Route path="/student" element={<MePage />} />
      </Routes>
    </Router>
  </StrictMode>,
);