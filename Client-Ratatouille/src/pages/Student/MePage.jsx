import React from "react";
import Navbar from "../../components/Navbar.jsx";
import MainContent from "../../features/auth/MainContent.jsx";

export const MePage = () => {
  return (
    <div className="bg-[#f5f8fb] flex h-screen w-screen">
      <MainContent />
    </div>
  );
};

export default MePage;
