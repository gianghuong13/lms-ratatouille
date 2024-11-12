import React, { useState } from "react";
import StudentCard from "../../components/StudentCard";
import Searchbar from "../../components/Searchbar";

const AddCourseForm = ({onSubmit}) => {
    const [courseId, setCourseId] = useState('');
    const [courseName, setCourseName] = useState('');
    const [teacher, setTeacher] = useState('');
    const [term, setTerm] = useState('');

    const [selectedStudents, setSlectedStudents] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const allStudents = [
        {id: 1, name: 'Alice'},
        {id: 2, name: 'Bob'},
        {id: 3, name: 'Charlie'},
        {id: 4, name: 'David'},
    ]

    const handleSearch = (query) => {
        if (query) {
            const results = allStudents.filter(student =>
                student.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const addStudentToCourse = (student) => {
        if (!selectedStudents.some(s => s.id === student.id)) {
            setSlectedStudents([...selectedStudents, student]);
        }
    };

    const removeStudentFromCourse = (studentId) => {
        setSlectedStudents(selectedStudents.filter(s => s.id !== studentId));
    };

    
    const handleSubmit = ({ onSubmit }) => {
        e.preventDefault();
        // Call API
        onSubmit({courseId, courseName, teacher, term, students: selectedStudents });
        console.log({ courseId, courseName, teacher, term, students: selectedStudents });
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-section">
                    <label htmlFor="courseId" className="form-label">
                        Course ID
                    </label>
                    <input 
                        type="text"
                        id="courseId"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        required
                        placeholder="Enter course ID"
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="courseName" className="form-label">
                        Course Name
                    </label>
                    <input 
                        type="text"
                        id='courseName'
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                        placeholder="Enter course name"
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="term" className="form-label">
                        Term
                    </label>
                    <input 
                        type="text" 
                        id="term"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        required
                        placeholder="Enter term"
                        className="form-input"    
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="teacher" className="form-label">
                        Teacher
                    </label>
                    <input 
                        type="text"
                        id="teacher"
                        value={teacher}
                        onChange={(e) => setTeacher(e.target.value)}
                        required
                        placeholder="Enter teacher"
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <Searchbar
                        placeholder="Search students..."
                        onSearch={handleSearch}
                    />

                    <div className="search-results mt-2">
                        {searchResults.map(student => (
                            <div 
                                key={student.id}
                                onClick={() => addStudentToCourse(student)}
                                className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                                >
                                    {student.name} - {student.id}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-label">Students in Course</h3>
                    {selectedStudents.map(student => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            onRemove={() => removeStudentFromCourse(student.id)}
                        />
                    ))}
                </div>

                <div className="form-actions">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Create
                    </button>
                </div>
            </form>
        </>
    )
}

export default AddCourseForm;