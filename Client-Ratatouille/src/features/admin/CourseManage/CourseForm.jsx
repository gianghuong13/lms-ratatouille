import React, { useState, useEffect } from "react";
import axios from "axios";
import NameCard from "../../../components/NameCard";
import Searchbar from "../../../components/Searchbar";
import '../../../index.css';

const CourseForm = ({mode, initialCourseId, initialData = {}, onSubmit}) => {
    const [courseId, setCourseId] = useState(initialCourseId || "");
    const [courseName, setCourseName] = useState(initialData.courseName || "");
    const [term, setTerm] = useState(initialData.term || "");
    const [terms, setTerms] = useState([]);
    const [classroom, setClassroom] = useState(initialData.classroom || "");
    const [selectedStudents, setSelectedStudents] = useState(initialData.students || []);
    const [selectedTeachers, setSelectedTeachers] = useState(initialData.teachers || []);
    const [searchResultsStudents, setSearchResultsStudents] = useState([]);
    const [searchResultsTeacher, setSearchResultsTeacher] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTerms();
        fetchStudents();
        fetchTeachers();
        if (mode === "edit" && initialCourseId) {
            fetchCourseDetails(initialCourseId);
        }
    }, [mode, initialCourseId]);

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

    const fetchCourseDetails = async (courseId) => {
        try {
            const response = await axios.get(`/api/courses/${courseId}`);
            const course = response.data;
            setCourseId(course.course_id);
            setCourseName(course.course_name);
            setClassroom(course.classroom);
            setTerm(course.term_id);
            setSelectedTeachers(course.teachers || []);
            setSelectedStudents(course.students || []);
        } catch (error) {
            console.error('Failed to fetch course details:', error);
            alert('Could not load course details');
        }
    };

    const handleSearch = (query) => {
        if (query) {
            const studentResults = allStudents.filter(student =>
                student.user_id.toLowerCase().includes(query.toLowerCase()) ||
                student.full_name.toLowerCase().includes(query.toLowerCase())
            );
            const teacherResults = allTeachers.filter(teacher =>
                teacher.user_id.toLowerCase().includes(query.toLowerCase()) ||
                teacher.full_name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResultsStudents(studentResults);
            setSearchResultsTeacher(teacherResults);
        } else {
            setSearchResultsStudents([]);
            setSearchResultsTeacher([]);
        }
    };

    const addStudentToCourse = (student) => {
        if (!selectedStudents.some(s => s.user_id === student.user_id)) {
            setSelectedStudents([...selectedStudents, student]);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const courseData = {
            course_id: courseId,
            course_name: courseName,
            term_id: term,
            classroom: classroom,
            teachers: selectedTeachers.map(t => t.user_id),
            students: selectedStudents.map(s => s.user_id),
        };

        try {
            if (mode === "add") {
                await axios.post('/api/courses/add', courseData);
                alert("Course created successfully");
            } else if (mode === "edit") {
                await axios.put(`/api/courses/${courseId}`, courseData);
                alert("Course updated successfully");
            }
            if (onSubmit) {
                onSubmit();
            }
        } catch (error) {
            console.error("Failed to submit course: ", error);
            alert("Failed to submit course");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <div className="flex p-3">
                <div className="w-1/4 bg-white p-4 shadow-md rounded-lg mr-6">
                    <Searchbar placeholder="Search students or teachers..." onSearch={handleSearch} />
                    <div className="h-80 overflow-y-auto mt-5">
                    <div className="mt-6">      
                        {searchResultsStudents.map(student => (
                            <div
                                key={student.user_id}
                                onClick={() => addStudentToCourse(student)}
                                className="flex justify-between cursor-pointer p-1 hover:bg-blue-100 rounded border mt-2"
                            >
                                <div className="text-sm">
                                    {student.user_id} {student.full_name}
                                </div>
                                <span className="border border-gray-300 bg-gray-300 p-0.5 text-center text-sm rounded-lg">{student.role}</span> 
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        {searchResultsTeacher.map(teacher => (
                            <div
                                key={teacher.user_id}
                                onClick={() => addTeacherToCourse(teacher)}
                                className="flex justify-between cursor-pointer p-1 hover:bg-green-100 rounded border mt-2"
                            >
                                <div className="text-sm">
                                    {teacher.user_id} {teacher.full_name}
                                </div>
                                <span className="border border-gray-300 bg-gray-300 p-0.5 text-center text-sm rounded-lg">{teacher.role}</span> 
                            </div>
                        ))}
                    </div>
                    </div>
                </div>

                <div className="w-3/4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                placeholder="Course ID"
                                className={`form-input p-3 border rounded-lg w-full ${
                                    mode === "edit" ? "bg-gray-100 cursor-not-allowed" : "bg-blue-200"
                                }`}
                                readOnly={mode === "edit"}
                                required
                            />
                            <input
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                placeholder="Course Name"
                                className="bg-blue-200 form-input p-3 border rounded-lg w-full"
                                required
                            />
                            <select
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                className="bg-blue-200 form-input p-3 border rounded-lg w-full"
                                required
                            >
                                <option value="">Select Term</option>
                                {terms.map(term => (
                                    <option className="bg-white" key={term.term_id} value={term.term_id}>
                                        {term.term_name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={classroom}
                                onChange={(e) => setClassroom(e.target.value)}
                                placeholder="Classroom"
                                className="bg-blue-200 form-input p-3 border rounded-lg w-full"
                                required
                            />
                        </div>

                        <div className="flex justify-between">
                            <div>
                                
                                {selectedStudents.map(student => (
                                    <NameCard
                                        key={student.user_id}
                                        person={student}
                                        onRemove={() => removeStudentFromCourse(student.user_id)}
                                    />
                                ))}
                            </div>
                            <div>
                                
                                {selectedTeachers.map(teacher => (
                                    <NameCard
                                        key={teacher.user_id}
                                        person={teacher}
                                        onRemove={() => removeTeacherFromCourse(teacher.user_id)}
                                    />
                                ))}
                            </div>
                        </div>

                        <button type="submit"
                            className={`bg-blue-600 text-white py-2 px-4 rounded ${
                                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : mode === "add" ? "Create Course" : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CourseForm