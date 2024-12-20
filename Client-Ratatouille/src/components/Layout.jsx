import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import WelcomCard from './WelcomCard';
import PageTitle from './PageTitle';
const Layout = ({ children }) => {
    const { courseId } = useParams(); // Lấy courseId từ URL
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Trạng thái mở/đóng sidebar

    const handleHamburgerClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <div className="bg-[#F5F8FB] flex-1">
        <WelcomCard />
        <PageTitle title="Courses"/>
        <div className="px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white flex flex-col relative">
            <Header  
                courseId={courseId}
                // breadcrumbItems={breadcrumbItems}
                onHamburgerClick={handleHamburgerClick}
            />

            <div className='flex flex-1 py-2'>
                <div className={`transition-all duration-100 ease-in-out bg-white ${
                        isSidebarOpen ? 'w-50 border-r' : 'w-0'
                    }  h-full sticky top-0`}>
                    <Sidebar isOpen={isSidebarOpen} courseId={courseId} />
                </div>
                {/* <Sidebar isOpen={isSidebarOpen} courseId={courseId} /> */}

                <div className='flex-1 overflow-y-auto p-2 ml-2 h-[77vh] border rounded-xl'>
                    {children}
                </div>
            </div>
        </div>
    </div>
    
  );
};

export default Layout;