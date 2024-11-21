import React from "react";
import Navbar from "../../components/NavBarStudent.jsx";
import TaskBar from "../../components/TaskBar.jsx";


export const StudentPage = () => {
  return (
    <div className="bg-[#f5f8fb] flex h-screen w-screen">
      <Navbar />
      <TaskBar/>
    </div>
  );
};

export default StudentPage;
