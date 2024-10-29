import React from "react";
import Sidebar from "./SideBar";
import MainContent from "./MainContent";

export const Me = () => {
  return (
    <div className="bg-[#f5f8fb] flex h-screen w-screen">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Me;
