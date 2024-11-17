import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

const CourseTable = ({ courses, selectedTerm, fetchCourses }) => {
    const filteredCourses = selectedTerm === 'All' ? courses : courses.filter(course => course.term_name === selectedTerm);

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
    return (
        <div className="table-container overflow-x-auto">
        <table className="min-w-[1024px] w-full bg-white border border-gray-300">
            <thead>
            <tr>
                <th className="px-4 py-2 border">Course ID</th>
                <th className="px-4 py-2 border">Course Name</th>
                <th className="px-4 py-2 border">Teacher</th>
                <th className="px-4 py-2 border">Term</th>
                <th className="px-4 py-2 border">Total Students</th>
                <th className="px-4 py-2 border">Classroom</th>
                <th className="px-4 py-2 border">Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredCourses
                .map(course => (
                <tr key={course.course_id}>
                    <td className="px-4 py-2 border">{course.course_id}</td>
                    <td className="px-4 py-2 border">{course.course_name}</td>
                    <td className="px-4 py-2 border">{course.teacher}</td>
                    <td className="px-4 py-2 border">{course.term_name}</td>
                    <td className="px-4 py-2 border">{course.total_students}</td>
                    <td className="px-4 py-2 border">{course.classroom}</td>
                    <td className="px-4 py-2 border">
                        <Link to={`/admin/courses/edit/${course.course_id}`} className="text-blue-500">
                            Edit
                        </Link>
                        <button 
                            onClick={() => deleteCourse(course.course_id)}
                            className="text-red-500 ml-2"
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
