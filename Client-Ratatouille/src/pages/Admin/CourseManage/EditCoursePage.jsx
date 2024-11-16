import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditCourseForm from '../../../features/Course/EditCourseForm';
import Navbar from '../../../components/Navbar';

const EditCoursePage = () => {
    const { courseId } = useParams();
    console.log('Params courseId:', courseId);
    const navigate = useNavigate();

    const handleFormSubmit = () => {
        navigate('/admin/courses'); // Redirect to courses page after update
    };

    return (
        <>
          <Navbar />
          <div className="container mx-auto p-4">
              <h1 className="text-2xl mb-4">Edit Course</h1>
              <EditCourseForm courseId={courseId} onSubmit={handleFormSubmit} />
          </div>
        </>
    );
};

export default EditCoursePage;
