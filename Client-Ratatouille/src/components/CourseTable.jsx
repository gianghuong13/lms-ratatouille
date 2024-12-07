import axios from 'axios';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import sort from "../assets/User_Screen/Sort.svg"; 

const CourseTable = ({ courses, fetchCourses, sortConfig, onSort, onDelete }) => {

    // const filteredCourses = selectedTerm === 'All' ? courses : courses.filter(course => course.term_name === selectedTerm);
    const requestSort = (key) => {
        onSort(key);
    };

    // const deleteCourse = async (courseId) => {
    //     try {
    //         const response = await axios.delete(`/api/courses/${courseId}`);
    //         fetchCourses();
    //         alert('Course deleted successfully');
    //     } catch (error) {
    //         console.error('Error deleting course:', error);
    //         alert('Failed to delete course');
    //     }
    // };

    return (
        <div className="table-container overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 mt-2 ml-2 mb-5 border-collapse">
                <thead className=''>
                    <tr className="bg-blue-200">
                        <th className="px-2 py-2 border w-[100px] cursor-pointer" onClick={() => requestSort('course_id')}>
                            <div className="flex justify-center items-center">
                            ID {sortConfig.key === 'course_id'}
                                <div className="ml-1">
                                    <img src={sort} alt="sort" />
                                </div>
                            </div>
                        </th>
                        <th className="px-2 py-2 border w-[280px] cursor-pointer" onClick={() => requestSort('course_name')}>
                            <div className="flex justify-center items-center">
                                Course Name {sortConfig.key === 'course_name'}
                                <div className="ml-1">
                                    <img src={sort} alt="sort" />
                                </div>
                            </div>
                        </th>
                        <th className="px-2 py-2 border w-[200px] cursor-pointer">
                            Teachers
                        </th>
                        <th className="px-2 py-2 border w-[230px] cursor-pointer" onClick={() => requestSort('term_name')}>
                            <div className="flex justify-center items-center">
                            Term {sortConfig.key === 'term_name'}
                                <div className="ml-1">
                                    <img src={sort} alt="sort" />
                                </div>
                            </div>
                        </th>
                        <th className="px-2 py-2 border text-sm cursor-pointer" onClick={() => requestSort('total_students')}>
                            No. Students{sortConfig.key === 'total_students'}
                        </th>
                        <th className="px-2 py-2 border">Classroom</th>
                        <th className="px-2 py-2 w-[150px] border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {courses
                    .map(course => (
                    <tr key={course.course_id}>
                        <td className="px-2 py-2 border w-[100px]">{course.course_id}</td>
                        <td className="px-2 py-2 border w-[300px]">{course.course_name}</td>
                        <td className="px-2 py-2 border w-[200px]">{course.teachers}</td>
                        <td className="px-2 py-2 border w-[230px]">{course.term_name}</td>
                        <td className="px-2 py-2 border">{course.total_students}</td>
                        <td className="px-2 py-2 border">{course.classroom}</td>
                        <td className="px-2 py-2 w-[150px] border text-center">
                            <Link to={`/admin/courses/edit/${course.course_id}`} className="mr-3 px-2 py-1 rounded bg-green-500 text-white hover:bg-green-700">
                                Edit
                            </Link>
                            <button 
                                onClick={() => onDelete(course.course_id)}
                                className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
  );
};

export default CourseTable;
