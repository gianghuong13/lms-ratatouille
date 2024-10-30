import React from "react";
import Navbar from "../components/admin/Navbar.jsx";
import MainContent from "../features/auth/MainContent.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';

export const MePage = () => {
  return (
    <div className="bg-[#f5f8fb] flex h-screen w-screen">
      <Navbar />
      <MainContent />
    </div>
  );
};

export default MePage;
