import React from 'react';
import { Link } from 'react-router-dom'; // Dùng để điều hướng với React Router
import { useSelector } from 'react-redux'; 

const Sidebar = ({ isOpen, courseId }) => {
  const role = useSelector((state) => state.auth.role);
  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-white ${isOpen ? 'w-50 p-4' : 'w-0 p-0'} h-full`}
    >
      <ul className="space-y-4">
        <li>
          <Link to={`/${role}/courses/${courseId}`} className={`block ${isOpen ? 'text-blue-800' : 'text-white'} p-2`}>
            Home
          </Link>
        </li>
        <li>
        <Link to={`/${role}/courses/${courseId}/assignments`} className={`block ${isOpen ? 'text-blue-800' : 'text-white'} p-2`}>
            Assignments
          </Link>
        </li>
        <li>
          <Link to={`/${role}/courses/${courseId}/discussions`} className={`block ${isOpen ? 'text-blue-800' : 'text-white'} p-2`}>
            Discussions
          </Link>
        </li>
        <li>
          <Link to={`/${role}/courses/${courseId}/grades`} className={`block ${isOpen ? 'text-blue-800' : 'text-white'} p-2`}>
            Grades
          </Link>
        </li>
        <li>
          <Link to={`/${role}/courses/${courseId}/people`} className={`block ${isOpen ? 'text-blue-800' : 'text-white'} p-2`}>
            People
          </Link>
        </li>
        <li>
          <Link to={`/${role}/courses/${courseId}/files`} className={`block ${isOpen ? 'text-blue-800' : 'text-white'} p-2`}>
            Files
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
