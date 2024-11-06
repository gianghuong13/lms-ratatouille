import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter as  Route, Routes, Navigate } from 'react-router-dom';
import { Route, Routes,Navigate,BrowserRouter } from "react-router-dom";
import App from './App';
import LoginPage from './pages/LoginPage.jsx';
import MePage from './pages/MePage.jsx';

import './index.css';
import ProtectedRoutes from './middlewares/Frontend/ProtectedRoute.jsx';
import UnauthorizedRoutes from './middlewares/Frontend/UnauthorizedRoute.jsx';

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" element={<MePage />} />
        <Route path="/teacher" element={<MePage />} />
        <Route path="/student" element={<MePage />} />
      </Route>
      <Route element={<UnauthorizedRoutes />}>
        <Route path="/" element={<Navigate to="index" replace />} />
        <Route path="/index" element={<LoginPage />} />
      </Route>
      
      </Routes>
    </BrowserRouter>
      
  </StrictMode>,
);

