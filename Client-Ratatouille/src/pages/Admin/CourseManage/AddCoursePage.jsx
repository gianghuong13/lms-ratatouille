import React from "react";
import { useNavigate } from "react-router-dom";
import AddCourseForm from "../../../features/admin/CourseManage/AddCourseForm.jsx";
import Navbar from "../../../components/Navbar.jsx";

const AddCoursePage = () => {
    const navigate = useNavigate();

    const handleFormSubmit = (data) => {
        console.log(data);
        // Add course to database
        // Redirect to course manage page
        navigate('/admin/courses');
    };

    return (
        <>
            {/* <Navbar /> */}
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