import React from "react";
import { Route, Routes, Router, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage"
import MePage from "./pages/MePage";

import AdminHome from "./pages/admin/AdminHome";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminMe from "./pages/admin/AdminMe";

const App = () => {
    return (
        <Routes>  
            <Route path="/" element={<Navigate to="login" replace/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/admin-classes" element={<AdminClasses />} />
            <Route path="/admin-accounts" element={<AdminAccounts />} />
            <Route path="/admin-notifications" element={<AdminNotifications />} />
            <Route path="/admin-me" element={<AdminMe />} />



            <Route path="/teacher" element={<MePage />} />
            <Route path="/student" element={<MePage />} />
        </Routes>
    );
};

export default App;