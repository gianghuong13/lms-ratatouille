import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import MePage from './pages/Admin/MePage.jsx';
import TeacherPage from './pages/Teacher/MePage.jsx';
import ProtectedRoutes from './middlewares/ProtectedRoute.jsx';
import UnauthorizedRoutes from './middlewares/UnauthorizedRoute.jsx';
import DashboardPage from './pages/Admin/Dashboard.jsx';

import CourseManagePage from './pages/Admin/CourseManage/CourseManagePage.jsx';
import AddCoursePage from './pages/Admin/CourseManage/AddCoursePage.jsx';
import EditCoursePage from './pages/Admin/CourseManage/EditCoursePage.jsx';
import Notifications from './pages/Admin/NotiManage/Notifications.jsx';
import CreateNotification from './pages/Admin/NotiManage/CreateNotification.jsx';
import UpdateNotification from './pages/Admin/NotiManage/UpdateNotification.jsx';

import 'global';
import Dashboard from './pages/Admin/Dashboard.jsx';
import DashboardHome from './pages/Student/StudentPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" >
          <Route index element={<Dashboard />} />
          <Route path="" element={<Dashboard />} />
          <Route path="me" element={<MePage />} />
          <Route path='courses'element={<CourseManagePage />} />
          <Route path='courses/add' element={<AddCoursePage />} />
          <Route path='courses/edit/:courseId' element={<EditCoursePage />}/>
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications/create-notification" element={<CreateNotification />} />
          <Route path="notifications/update-notification/:id" element={<UpdateNotification />} />
        </Route>
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/student">
          <Route index element={<DashboardHome />} />
          
        </Route>
      </Route>
      <Route element={<UnauthorizedRoutes />}>
        <Route path="/" element={<Navigate to="login" replace />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};

export default App;