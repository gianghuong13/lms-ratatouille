import React from 'react';
import { Link } from 'react-router-dom'; // Giúp điều hướng nếu bạn sử dụng react-router
import sidebarIcon from '../assets/User_Screen/menu.svg';
const Header = ({ courseId, breadcrumbItems, onHamburgerClick }) => {
  return (
    <header className='p-2'>
        <div className="flex items-center justify-start py-2 bg-white border-b border-gray-500">
            <button onClick={onHamburgerClick} className="text-blue-500">
                <img src={sidebarIcon} alt="sidebar" />
            </button>

            <div className="flex items-center space-x-4">
                <span className="font-semibold text-xl">
                    { courseId }
                </span>
            </div>

            <div className="flex items-center space-x-2">
                {/* {breadcrumbItems.map((item, index) => {
                    <React.Fragment key={index}>
                        <Link to={item.path} className='text-blue-500 hover:underline'>
                            {item.label}
                        </Link>
                        {index < breadcrumbItems.length - 1 && <span className='text-gray-500'>&gt;</span>}
                    </React.Fragment>
                })} */}
            </div>
        </div>
    </header>
  );
};

export default Header;
