import React from "react";
import PageTitle from "../../components/PageTitle.jsx";
import WelcomCard from "../../components/WelcomCard.jsx";
import MainContent from "../../features/auth/MainContent.jsx";

export const MePage = () => {
  return (
    <div className="bg-[#F5F8FB] flex-1">
      <WelcomCard />
      <PageTitle title="Me" />
      <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
        <MainContent />
      </div>
      
    </div>
    
  );
};

export default MePage;
