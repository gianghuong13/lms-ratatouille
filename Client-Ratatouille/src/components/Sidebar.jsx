import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation to track current path
import { useSelector } from 'react-redux'; 

const Sidebar = ({ isOpen, courseId }) => {
  const role = useSelector((state) => state.auth.role);
  const location = useLocation(); // Track the current route

  const links = [
    { name: 'Home', to: `/${role}/courses/${courseId}` },
    { name: 'Assignments', to: `/${role}/courses/${courseId}/assignments` },
    { name: 'Discussions', to: `/${role}/courses/${courseId}/discussions` },
    { name: 'Grades', to: `/${role}/courses/${courseId}/grades` },
    { name: 'People', to: `/${role}/courses/${courseId}/people` },
    { name: 'Files', to: `/${role}/courses/${courseId}/files` },
  ];

  // Check if a link is active
  const isActiveLink = (path) => {
    if (path === `/${role}/courses/${courseId}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className='h-full sticky top-0 bg-white p-4'
    >
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.to}
              className={`block p-2 hover:underline text-blue-800 ${isOpen ? 'visible' : 'invisible'} ${
                isActiveLink(link.to) ? 'font-bold' : ''
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
