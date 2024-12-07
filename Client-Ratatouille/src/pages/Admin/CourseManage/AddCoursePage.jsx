import React from "react";
import { useNavigate } from "react-router-dom";
import AddCourseForm from "../../../features/admin/CourseManage/AddCourseForm.jsx";
import WelcomCard from "../../../components/WelcomCard.jsx";
import PageTitle from "../../../components/PageTitle.jsx";

const AddCoursePage = () => {
    const navigate = useNavigate();

    const handleFormSubmit = (data) => {
        // Add course to database
        // Redirect to course manage page
        navigate('/admin/courses');
    };

    return (
        <>
            <div className="bg-[#F5F8FB] flex-1"> 
                <WelcomCard />
                <PageTitle title="Courses Management" at="Create course"/>
                <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
                <AddCourseForm onSubmit={handleFormSubmit} />

                </div>
            </div>
        </>
        
    )
};

export default AddCoursePage;