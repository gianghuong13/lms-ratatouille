import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

import ProtectedRoutes from './middlewares/ProtectedRoute.jsx';
import UnauthorizedRoutes from './middlewares/UnauthorizedRoute.jsx';
import Navbar from './components/Navbar.jsx';
// Page Login
import LoginPage from './pages/LoginPage.jsx';
// Page Admin
import MePage from './pages/Admin/MePage.jsx';
import AdminDashboardPage from './pages/Admin/AdminDashboard.jsx';
import CourseManagePage from './pages/Admin/CourseManage/CourseManagePage.jsx';
import AddCoursePage from './pages/Admin/CourseManage/AddCoursePage.jsx';
import EditCoursePage from './pages/Admin/CourseManage/EditCoursePage.jsx';
import Notifications from './pages/Admin/NotiManage/Notifications.jsx';
import CreateNotification from './pages/Admin/NotiManage/CreateNotification.jsx';
import UpdateNotification from './pages/Admin/NotiManage/UpdateNotification.jsx';
import AccountManagePage from './pages/Admin/AccountManage/AccountManagePage.jsx';
import CreateAccountPage from './pages/Admin/AccountManage/CreateAccountPage.jsx';
import EditAccountPage from './pages/Admin/AccountManage/EditAccountPage.jsx';
import 'global';
// Page chung cho Student va Teacher
import Dashboard from './pages/Teacher/TeacherPage.jsx';
// Page Student
// Page Teacher
import AllCoursesList from './pages/Teacher/AllCourses.jsx';

const App = () => {
  const [role, setRole] = useState(null);
  const location = useLocation(); // Hook để lấy đường dẫn hiện tại

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    setRole(savedRole);
  }, []);

  // Điều kiện để Navbar chỉ hiển thị ở các trang không phải login
  const shouldShowNavbar = role && location.pathname !== '/login';

  return (
    <>
      {shouldShowNavbar && <Navbar role={role} />}
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin">
            <Route index element={<AdminDashboardPage />} />
            <Route path="" element={<AdminDashboardPage />} />

            <Route path="accounts" element={<AccountManagePage />} />
            <Route path="accounts/create" element={<CreateAccountPage />} />
            <Route path="account/edit/:userId" element={<EditAccountPage />} />

            <Route path='courses' element={<CourseManagePage />} />
            <Route path='courses/add' element={<AddCoursePage />} />
            <Route path='courses/edit/:courseId' element={<EditCoursePage />} />

            <Route path="notifications" element={<Notifications />} />
            <Route path="notifications/create-notification" element={<CreateNotification />} />
            <Route path="notifications/update-notification/:id" element={<UpdateNotification />} />
            
            <Route path="me" element={<MePage />} />
          </Route>
          <Route path="/teacher">
            <Route index element={<Dashboard />} />
            <Route path="" element={<Dashboard />} />
            <Route path="account" element={<MePage />} />
            <Route path="courses" element={<AllCoursesList />} />
          </Route>
          <Route path="/student">
            <Route index element={<Dashboard />} />
            <Route path="" element={<Dashboard />} />
            <Route path="account" element={<MePage />} />
          </Route>
        </Route>
        <Route element={<UnauthorizedRoutes />}>
          <Route path="/" element={<Navigate to="login" replace />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
