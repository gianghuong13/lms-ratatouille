import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'antd/dist/reset.css';
import ToggleSwitch from './components/ToggleSwitch';
import AccountManagePage from './pages/Admin/AccountManage/AccountManagePage'; 
import AddButton from './components/AddButton';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);