import React, { useState } from 'react';
import Searchbar from '../../../components/Searchbar';
import Dropdown from '../../../components/Dropdown';
import AddButton from '../../../components/AddButton';
import Navbar from '../../../components/Navbar';
import { Link } from 'react-router-dom';

const CourseManagePage = () => {
  const [selectedTerm, setSelectedTerm] = useState('Fall');
  const options = ['Fall', 'Spring', 'Summer'];

  const handleSelect = (value) => {
    setSelectedTerm(value);
  };

  const courses = [
    {
      courseId: 'INT111',
      courseName: 'Development',
      teacher: 'John Doe',
      term: 'Fall',
      totalStudents: 15,
    },
  ];
    
  return (
    <>
    <div>
      <Navbar/>
    </div>
    <div className="flex flex-col p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Course Management</h1>
        <div className="flex items-center mb-4 space-x-4">
          <div className='mr-10'>
            <Searchbar />
          </div>
          <div className='flex-grow'>
            <Dropdown options={options} onSelect={handleSelect} />
          </div>
          <div className=''>
            <Link to="/admin/courses/add">
              <AddButton label="New Course" />
            </Link>
          </div>
        </div>
        <div className="table-container overflow-x-auto">
          <table className="min-w-[1024px] w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Course ID</th>
                <th className="px-4 py-2 border">Course Name</th>
                <th className="px-4 py-2 border">Teacher</th>
                <th className="px-4 py-2 border">Term</th>
                <th className="px-4 py-2 border">Total Students</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-4 py-2 border">{course.courseId}</td>
                  <td className="px-4 py-2 border">{course.courseName}</td>
                  <td className="px-4 py-2 border">{course.teacher}</td>
                  <td className="px-4 py-2 border">{course.term}</td>
                  <td className="px-4 py-2 border">{course.totalStudents}</td>
                  <td className="px-4 py-2 border">
                    {/* Edit Button */}
                    <Link to={`/admin/edit/${course.id}`} className="text-blue-500">
                      Edit
                    </Link>
                    <button className="text-red-500 ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseManagePage;