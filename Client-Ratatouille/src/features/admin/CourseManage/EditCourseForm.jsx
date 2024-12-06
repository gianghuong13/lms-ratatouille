import React from 'react';
import '../../../index.css';
import CourseForm from './CourseForm';

const EditCourseForm = ({ courseId, onSubmit }) => {
    return (
        <CourseForm mode="edit" initialCourseId={courseId} onSubmit={onSubmit} />
    );
};

export default EditCourseForm;
