import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditCourseForm from '../../../features/admin/CourseManage/EditCourseForm';
import PageTitle from '../../../components/PageTitle';
import WelcomCard from '../../../components/WelcomCard';
const EditCoursePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const handleFormSubmit = () => {
        navigate('/admin/courses'); // Redirect to courses page after update
    };

    return (
        <>
          <div className="bg-[#F5F8FB] flex-1"> 
                <WelcomCard />
                <PageTitle title="Courses Management" at="Edit course"/>
                <div className="m-0 p-3 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
                    <EditCourseForm courseId={courseId} onSubmit={handleFormSubmit} />
                </div>
            </div>
        </>
    );
};

export default EditCoursePage;
