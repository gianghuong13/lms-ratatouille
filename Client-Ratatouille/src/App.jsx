import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import ProtectedRoutes from './middlewares/ProtectedRoute.jsx';
import UnauthorizedRoutes from './middlewares/UnauthorizedRoute.jsx';

// Page Login
import LoginPage from './pages/LoginPage.jsx';
// Page Admin
import AdminMePage from './pages/Admin/MePage.jsx';
import DashboardPage from './pages/Admin/Dashboard.jsx';
import CourseManagePage from './pages/Admin/CourseManage/CourseManagePage.jsx';
import AddCoursePage from './pages/Admin/CourseManage/AddCoursePage.jsx';
import EditCoursePage from './pages/Admin/CourseManage/EditCoursePage.jsx';
import Notifications from './pages/Admin/NotiManage/Notifications.jsx';
import CreateNotification from './pages/Admin/NotiManage/CreateNotification.jsx';
import UpdateNotification from './pages/Admin/NotiManage/UpdateNotification.jsx';
import 'global';
// Page Student
import DashboardHomeStudent from './pages/Student/StudentPage.jsx';
// Page Teacher
import DashboardHomeTeacher from './pages/Teacher/TeacherPage.jsx';
const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" >
          <Route index element={<DashboardPage />} />
          <Route path="" element={<DashboardPage />} />
          <Route path="me" element={<AdminMePage />} />
          <Route path='courses'element={<CourseManagePage />} />
          <Route path='courses/add' element={<AddCoursePage />} />
          <Route path='courses/edit/:courseId' element={<EditCoursePage />}/>
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications/create-notification" element={<CreateNotification />} />
          <Route path="notifications/update-notification/:id" element={<UpdateNotification />} />
        </Route>
        <Route path="/teacher">
          <Route index element={<DashboardHomeTeacher />} />
          <Route path="dashboard" element={<DashboardHomeTeacher />} />
        </Route>
        <Route path="/student">
          <Route index element={<DashboardHomeStudent />} />
          <Route path="dashboard" element={<DashboardHomeStudent />} />
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