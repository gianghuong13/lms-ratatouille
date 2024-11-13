import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/Admin/MePage.jsx';
import TeacherPage from './pages/Teacher/MePage.jsx';
import StudentPage from './pages/Student/MePage.jsx';
import ProtectedRoutes from './middlewares/ProtectedRoute.jsx';
import UnauthorizedRoutes from './middlewares/UnauthorizedRoute.jsx';
import HomePage from './pages/Admin/Home.jsx';
import Notifications from './pages/Admin/Notifications.jsx';
import Classes from './pages/Admin/Classes.jsx';

const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" >
          <Route index element={<HomePage />} />
          {/* <Route path="" element={<HomePage />} /> */}
          <Route path="notifications" element={<Notifications />} />
          <Route path="classes" element={<Classes />} />
        </Route>
        <Route path="/teacher" element={<TeacherPage />} /> 
        <Route path="/student" element={<StudentPage />} />
      </Route>
      <Route element={<UnauthorizedRoutes />}>
        <Route path="/" element={<Navigate to="login" replace />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};

export default App;