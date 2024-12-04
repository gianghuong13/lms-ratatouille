import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoutes from './middlewares/ProtectedRoute.jsx';
import UnauthorizedRoutes from './middlewares/UnauthorizedRoute.jsx';
import Navbar from './components/Navbar.jsx';
// Page Login
import LoginPage from './pages/LoginPage.jsx';
// Page Admin
import MePage from './pages/Admin/MePage.jsx';
import AdminDashboardPage from './pages/Admin/AdminDashboard.jsx';
import AccountManagePage from './pages/Admin/AccountManage/AccountManagePage.jsx';
import CreateAccountPage from './pages/Admin/AccountManage/CreateAccountPage.jsx';
import EditAccountPage from './pages/Admin/AccountManage/EditAccountPage.jsx';
import CourseManagePage from './pages/Admin/CourseManage/CourseManagePage.jsx';
import AddCoursePage from './pages/Admin/CourseManage/AddCoursePage.jsx';
import EditCoursePage from './pages/Admin/CourseManage/EditCoursePage.jsx';
import Notifications from './pages/Admin/NotiManage/Notifications.jsx';
import CreateNotification from './pages/Admin/NotiManage/CreateNotification.jsx';
import UpdateNotification from './pages/Admin/NotiManage/UpdateNotification.jsx';

import 'global';
// Page chung cho Student và Teacher
import Dashboard from './pages/Teacher/DashboardPage.jsx';

// Page Student
import SNotifications from './pages/Student/NotiManage/SNotifications.jsx';
import SDetailNotification from './pages/Student/NotiManage/SDetailNotification.jsx';

// Page Teacher
// import AllCoursesList from './pages/Teacher/AllCourses.jsx';
import CoursesList from './pages/CoursesList.jsx';
import CourseHome from './pages/Teacher/Course/CourseHome.jsx';
import CourseAssignments from './pages/Teacher/Course/CourseAssignments.jsx';
import CourseDiscussions from './pages/Teacher/Course/CourseDiscussions.jsx';
import CourseGrades from './pages/Teacher/Course/CourseGrades.jsx';
import CoursePeople from './pages/Teacher/Course/CoursePeople.jsx';
import CourseFiles from './pages/Teacher/Course/CourseFiles.jsx';

import TCreateNotification from './pages/Teacher/NotiManage/TCreateNotification.jsx';
import TNotifications from './pages/Teacher/NotiManage/TNotifications.jsx';
import TUpdateNotification from './pages/Teacher/NotiManage/TUpdateNotification.jsx';
import TDetailNotification from './pages/Teacher/NotiManage/TDetailNotification.jsx';
import FileDetail from './pages/Teacher/Course/FileDetail.jsx';


const App = () => {
  const role = useSelector((state) => state.auth.role);
  const location = useLocation(); // Hook để lấy đường dẫn hiện tại

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
            <Route path="accounts/edit/:userId" element={<EditAccountPage />} />

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
            <Route path="courses" element={<CoursesList />} />

            <Route path="notifications" element={<TNotifications  />} />
            <Route path="notifications/create-notification" element={<TCreateNotification  />} />
            <Route path="notifications/update-notification/:id" element={<TUpdateNotification  />} />
            <Route path="notifications/detail-notification/:id" element={<TDetailNotification  />} />

            <Route path="courses/:courseId" element={<CourseHome />} />
            <Route path='courses/:courseId/assignments' element={<CourseAssignments />} />
            <Route path='courses/:courseId/discussions' element={<CourseDiscussions />} />
            <Route path='courses/:courseId/grades' element={<CourseGrades />} />
            <Route path='courses/:courseId/people' element={<CoursePeople />} />
            <Route path='courses/:courseId/files' element={<CourseFiles />} />

            <Route path='courses/:courseId/files/:fileName' element={<FileDetail />} />

          </Route>
          <Route path="/student">
            <Route index element={<Dashboard />} />
            <Route path="" element={<Dashboard />} />
            <Route path="account" element={<MePage />} />
            <Route path="courses" element={<CoursesList />} />

            <Route path="notifications" element={<SNotifications />} />
            <Route path="notifications/detail-notification/:id" element={<SDetailNotification />} />
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