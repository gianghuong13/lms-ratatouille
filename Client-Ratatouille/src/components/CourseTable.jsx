import axios from 'axios';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const CourseTable = ({ courses, selectedTerm }) => {

    const filteredCourses = selectedTerm === 'All' ? courses : courses.filter(course => course.term_name === selectedTerm);

    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    const sortedCourses = useMemo(() => {
        let sortableCourses = [...filteredCourses];
        if (sortConfig.key) {
            sortableCourses.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableCourses;
    }, [filteredCourses, sortConfig]);

    const deleteCourse = async (courseId) => {
        try {
            const response = await axios.delete(`/api/courses/${courseId}`);
            fetchCourses();
            alert('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course');
        }
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="table-container overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 mt-2 ml-2 mb-5 border-collapse">
                <thead className=''>
                    <tr className="bg-blue-200">
                        <th className="px-2 py-2 border w-[130px] cursor-pointer" onClick={() => requestSort('course_id')}>
                            ID {sortConfig.key === 'course_id'}
                        </th>
                        <th className="px-2 py-2 border w-[280px] cursor-pointer" onClick={() => requestSort('course_name')}>
                            Course Name {sortConfig.key === 'course_name'}
                        </th>
                        <th className="px-2 py-2 border w-[200px] cursor-pointer" onClick={() => requestSort('teacher')}>
                            Teacher {sortConfig.key === 'teacher'}
                        </th>
                        <th className="px-2 py-2 border w-[230px] cursor-pointer" onClick={() => requestSort('term_name')}>
                            Term {sortConfig.key === 'term_name'}
                        </th>
                        <th className="px-2 py-2 border text-sm cursor-pointer" onClick={() => requestSort('total_students')}>
                            No. Students{sortConfig.key === 'total_students'}
                        </th>
                        <th className="px-2 py-2 border">Classroom</th>
                        <th className="px-2 py-2 w-[150px] border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {sortedCourses
                    .map(course => (
                    <tr key={course.course_id}>
                        <td className="px-2 py-2 border w-[130px]">{course.course_id}</td>
                        <td className="px-2 py-2 border w-[300px]">{course.course_name}</td>
                        <td className="px-2 py-2 border w-[200px]">{course.teacher}</td>
                        <td className="px-2 py-2 border w-[230px]">{course.term_name}</td>
                        <td className="px-2 py-2 border">{course.total_students}</td>
                        <td className="px-2 py-2 border">{course.classroom}</td>
                        <td className="px-2 py-2 w-[150px] border text-center">
                            <Link to={`/admin/courses/edit/${course.course_id}`} className="mr-3 px-2 py-1 rounded bg-green-500 text-white hover:bg-green-700">
                                Edit
                            </Link>
                            <button 
                                onClick={() => deleteCourse(course.course_id)}
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
