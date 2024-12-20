import React from "react";
import TaskBar from "../../components/TaskBar.jsx";
import CourseCard from "../../components/CourseCard.jsx";
import PageTitle from "../../components/PageTitle.jsx";
import WelcomCard from "../../components/WelcomCard.jsx";
export const TeacherPage = () => {
  return (
    <div className="bg-[#F5F8FB] flex-1"> 
      <WelcomCard />
      <PageTitle title="Dashboard" />
      <div className="m-0 p-3 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
        <CourseCard />
      </div>
    </div>
  );
};

export default TeacherPage;
