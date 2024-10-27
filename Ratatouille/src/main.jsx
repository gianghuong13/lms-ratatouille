import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Login from './Login_screen/Login.jsx';
import './Login_screen/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login/>
  </StrictMode>,
);