import React, { useState } from "react";

const AddCourseForm = ({onSubmit}) => {
    const [courseId, setCourseId] = useState('');
    const [courseName, setCourseName] = useState('');
    const [teacher, setTeacher] = useState('');
    const [term, setTerm] = useState('');
    
    const handleSubmit = ({ onSubmit }) => {
        e.preventDefault();
        // Call API
        onSubmit({courseId, courseName, teacher, term});
        console.log({courseId, courseName, teacher, term});
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="">
                <div>
                    <label htmlFor="courseId" className="">
                        Course ID
                    </label>
                    <input 
                        type="text"
                        id="courseId"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        required
                        placeholder="Enter course ID"
                        className=""
                    />
                </div>

                <div className="">
                    <label htmlFor="courseName">
                        Course Name
                    </label>
                    <input 
                        type="text"
                        id='courseName'
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                        placeholder="Enter course name"
                        className=""
                    />
                </div>

                <div className="">
                    <label htmlFor="term">
                        Term
                    </label>
                    <input 
                        type="text" 
                        id="term"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        required
                        placeholder="Enter term"
                        className=""    
                    />
                </div>

                <div className="">
                    <label htmlFor="teacher">
                        Teacher
                    </label>
                    <input 
                        type="text"
                        id="teacher"
                        value={teacher}
                        onChange={(e) => setTeacher(e.target.value)}
                        required
                        placeholder="Enter teacher"
                        className=""
                    />
                </div>

                <div className="">
                    <button type="submit" className="">
                        Create Course
                    </button>
                </div>
            </form>
        </>
    )
}

export default AddCourseForm;