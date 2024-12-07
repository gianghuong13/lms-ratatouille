import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import WelcomCard from './WelcomCard';

const Layout = ({ children }) => {
    const { courseId } = useParams(); // Lấy courseId từ URL
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Trạng thái mở/đóng sidebar

    const handleHamburgerClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <div className="bg-[#F5F8FB] flex-1"> 
        <WelcomCard />
        <div className="px-2 sm:mx-2 rounded-2xl shadow-lg h-[89vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-scroll w-full">
            <div className='flex flex-col h-screen w-full'>
                <Header  
                    courseId={courseId}
                    // breadcrumbItems={breadcrumbItems}
                    onHamburgerClick={handleHamburgerClick}
                />

                <div className='flex flex-1'>
                    <Sidebar isOpen={isSidebarOpen} courseId={courseId} />

                    <div className='flex-1 w-full px-10'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Layout;
