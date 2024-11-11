import React, { useState } from "react";
import AddCourseForm from "../../../features/Course/AddCourseForm.jsx";

const AddCoursePage = () => {
    const handleFormSubmit = (data) => {
        console.log(data);
    };

    return (
        <div>
            <h1>Create New Course</h1>
            <div>
                <AddCourseForm onSubmit={handleFormSubmit} />
            </div>
        </div>
    )
};

export default AddCoursePage;