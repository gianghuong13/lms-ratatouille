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
  );
};

export default Layout;
