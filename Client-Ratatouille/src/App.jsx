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

import CourseManagePage from './pages/Admin/CourseManage/CourseManagePage.jsx';
import AddCoursePage from './pages/Admin/CourseManage/AddCoursePage.jsx';
import EditCoursePage from './pages/Admin/CourseManage/EditCourse.jsx';

import CreateNotification from './pages/Admin/CreateNotification.jsx';
import UpdateNotification from './pages/Admin/UpdateNotification.jsx';

import 'global';

const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" >
          <Route index element={<AdminPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path='courses'element={<CourseManagePage />} />
          <Route path='courses/add' element={<AddCoursePage />} />
          <Route path='courses/edit/:id' element={<EditCoursePage />}/>
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications/create-notification" element={<CreateNotification />} />
          <Route path="notifications/update-notification/:id" element={<UpdateNotification />} />
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