import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login_screen/Login.jsx';
import Me from './Admin_screen/Me.jsx';
import './Login_screen/index.css';
import './Admin_screen/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Me />} />
        <Route path="/teacher" element={<Me />} />
        <Route path="/student" element={<Me />} />
      </Routes>
    </Router>
  </StrictMode>,
);