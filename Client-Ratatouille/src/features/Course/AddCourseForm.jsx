import React, { useState, useEffect } from "react";
import axios from "axios";
import NameCard from "../../components/NameCard";
import Searchbar from "../../components/Searchbar";
import '../../index.css';

const AddCourseForm = ({ onSubmit }) => {
    const [courseId, setCourseId] = useState('');
    const [courseName, setCourseName] = useState('');
    const [term, setTerm] = useState('');
    const [terms, setTerms] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [searchResultsStudents, setSearchResultsStudents] = useState([]);
    const [searchResultsTeacher, setSearchResultsTeacher] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);

    useEffect(() => {
        fetchTerms();
        fetchStudents();
        fetchTeachers();
    }, []);

    const fetchTerms = async () => {
        try {
            const response = await axios.get('/api/terms');
            setTerms(response.data);
        } catch (error) {
            console.error("Failed to fetch terms: ", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get('/api/students');
            setAllStudents(response.data);
        } catch (error) {
            console.error("Failed to fetch students: ", error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('/api/teachers');
            setAllTeachers(response.data);
        } catch (error) {
            console.error("Failed to fetch teachers: ", error);
        }
    };

    // Tìm kiếm cho cả sinh viên và giảng viên
    const handleSearch = (query) => {
        if (query) {
            const studentResults = allStudents.filter(student =>
                student.full_name.toLowerCase().includes(query.toLowerCase())
            );
            const teacherResults = allTeachers.filter(teacher =>
                teacher.full_name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResultsStudents(studentResults);
            setSearchResultsTeacher(teacherResults);
        } else {
            setSearchResultsStudents([]);
            setSearchResultsTeacher([]);
        }
    };

    // Thêm sinh viên vào danh sách đã chọn
    const addStudentToCourse = (student) => {
        if (!selectedStudents.some(s => s.user_id === student.user_id)) {
            setSelectedStudents([...selectedStudents, student]);
        }
    };

    // Thêm giảng viên vào danh sách đã chọn
    const addTeacherToCourse = (teacher) => {
        if (!selectedTeachers.some(t => t.user_id === teacher.user_id)) {
            setSelectedTeachers([...selectedTeachers, teacher]);
        }
    };

    const removeStudentFromCourse = (studentId) => {
        setSelectedStudents(selectedStudents.filter(s => s.user_id !== studentId));
    };

    const removeTeacherFromCourse = (teacherId) => {
        setSelectedTeachers(selectedTeachers.filter(t => t.user_id !== teacherId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const courseData = {
            course_id: courseId,
            course_name: courseName,
            term_id: term,
            teachers: selectedTeachers.map(t => t.user_id),
            students: selectedStudents.map(s => s.user_id),
        };

        try {
            axios.post('/api/courses/add', courseData);
            alert("Course created successfully");
            if (onSubmit) {
                onSubmit();
            }
        } catch (error) {
            console.error("Failed to create course: ", error);
            alert("Failed to create course");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="info-container">
                    <div className="form-section">
                        <input
                            type="text"
                            id="courseId"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            required
                            placeholder="Enter course ID..."
                            className="form-input"
                        />
                    </div>
                    <div className="form-section">
                        <input
                            type="text"
                            id='courseName'
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            required
                            placeholder="Enter course name..."
                            className="form-input"
                        />
                    </div>
                    <div className="form-section">
                        <select 
                            id="term"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            required
                            className="form-input"
                        >
                            <option value="">Select Term</option>
                            {terms.map(term => (
                                <option key={term.term_id} value={term.term_id}>
                                    {term.term_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="min-w-24 w-1/3">
                    <Searchbar
                        placeholder="Search students or teachers..."
                        onSearch={handleSearch}
                    />
                </div>

                <div className="form-section">
                    <h3 className="mt-4">Students:</h3>
                    <div className="search-results mt-2">
                        {searchResultsStudents.map(student => (
                            <div
                                key={student.user_id}
                                onClick={() => addStudentToCourse(student)}
                                className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                            >
                                {student.full_name} - {student.user_id}
                            </div>
                        ))}
                    </div>

                    <h3 className="mt-4">Teachers:</h3>
                    <div className="search-results mt-2">
                        {searchResultsTeacher.map(teacher => (
                            <div
                                key={teacher.user_id}
                                onClick={() => addTeacherToCourse(teacher)}
                                className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                            >
                                {teacher.full_name} - {teacher.user_id}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-label">Students in Course</h3>
                    {selectedStudents.map(student => (
                        <NameCard
                            key={student.user_id}
                            person={student}
                            onRemove={() => removeStudentFromCourse(student.user_id)}
                        />
                    ))}
                </div>

                <div className="form-section">
                    <h3 className="form-label">Teachers in Course</h3>
                    {selectedTeachers.map(teacher => (
                        <NameCard
                            key={teacher.user_id}
                            person={teacher}
                            onRemove={() => removeTeacherFromCourse(teacher.user_id)}
                        />
                    ))}
                </div>

                <div className="form-actions">
                    <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Create
                    </button>
                </div>
            </form>
        </>
    );
};

export default AddCourseForm;
