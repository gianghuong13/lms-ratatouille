import React, { useState } from "react";
import AddCourseForm from "../../../features/Course/AddCourseForm.jsx";
import Navbar from "../../../components/Navbar.jsx";
import StudentCard from "../../../components/NameCard.jsx";

const AddCoursePage = () => {
    const handleFormSubmit = (data) => {
        console.log(data);
        // Call API
    };

    return (
        <>
            <Navbar />
            <div className="add-class-container">
                <h1 className="text-3xl font-bold mb-4">Create New Course</h1>
                <div className="">
                    <AddCourseForm onSubmit={handleFormSubmit} />
                </div>
            </div>
        </>
    )
};

export default AddCoursePage;