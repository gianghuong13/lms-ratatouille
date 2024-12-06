import React from "react";
import CourseForm from "./CourseForm";
import '../../../index.css';

const AddCourseForm = ({ onSubmit }) => {
    return (
        <CourseForm mode="add" onSubmit={onSubmit} />
    );
};

export default AddCourseForm;
