import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    const { courseId } = useParams(); // Lấy courseId từ URL
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Trạng thái mở/đóng sidebar

    const handleHamburgerClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <div className="bg-[#F5F8FB] flex-1">
        {/* <div className="px-2 sm:mx-2 rounded-2xl shadow-lg h-[89vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-scroll w-full"> */}
            <div className='h-screen w-full'>
                <Header  
                    courseId={courseId}
                    // breadcrumbItems={breadcrumbItems}
                    onHamburgerClick={handleHamburgerClick}
                />

                <div className='flex flex-1'>
                    <div className={`transition-all duration-100 ease-in-out bg-white ${
                            isSidebarOpen ? 'w-50' : 'w-0'
                        } border-r border-gray-300 h-full sticky top-0`}>
                        <Sidebar isOpen={isSidebarOpen} courseId={courseId} />
                    </div>
                    {/* <Sidebar isOpen={isSidebarOpen} courseId={courseId} /> */}

                    <div className='flex-1 overflow-y-auto'>
                        {children}
                    </div>
                </div>

            </div>
        {/* </div> */}
    </div>
  );
};

export default Layout;