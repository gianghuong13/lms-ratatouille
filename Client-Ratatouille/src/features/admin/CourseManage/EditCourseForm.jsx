import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NameCard from '../../../components/NameCard';
import Searchbar from "../../../components/Searchbar";
import '../../../index.css';

const EditCourseForm = ({ courseId, onSubmit }) => {
  const [courseName, setCourseName] = useState('');
  const [term, setTerm] = useState('');
  const [terms, setTerms] = useState([]);
  const [classroom, setClassroom] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [searchResultsStudents, setSearchResultsStudents] = useState([]);
  const [searchResultsTeacher, setSearchResultsTeacher] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);

    useEffect(() => {
        fetchCourseDetails(courseId);
        fetchTerms();
        fetchStudents();
        fetchTeachers();
    }, [courseId]);

    const fetchCourseDetails = async (courseId) => {
        try {
            const response = await axios.get(`/api/courses/${courseId}`);
            const course = response.data;
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

    const fetchTerms = async () => {
        try {
            const response = await axios.get('/api/terms');
            setTerms(response.data);
        } catch (error) {
            console.error('Failed to fetch terms:', error);
            alert('Could not load terms.');
        }
    };

  const fetchStudents = async () => {
      try {
          const response = await axios.get('/api/students');
          setAllStudents(response.data);
      } catch (error) {
          console.error("Failed to fetch students: ", error);
          alert('Could not load students.');
      }
  };

  const fetchTeachers = async () => {
      try {
          const response = await axios.get('/api/teachers');
          setAllTeachers(response.data);
      } catch (error) {
          console.error("Failed to fetch teachers: ", error);
          alert('Could not load teachers.');
      }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResultsStudents([]);
      setSearchResultsTeacher([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    setSearchResultsStudents(
      allStudents.filter((student) =>
        student.full_name.toLowerCase().includes(lowerQuery)
      )
    );
    setSearchResultsTeacher(
      allTeachers.filter((teacher) =>
        teacher.full_name.toLowerCase().includes(lowerQuery)
      )
    );
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
    
    const courseData = {
        course_name: courseName,
        term_id: term,
        classroom: classroom,
        teachers: selectedTeachers.map(t => t.user_id),
        students: selectedStudents.map(s => s.user_id),
    };

    try {
      await axios.put(`/api/courses/${courseId}`, courseData);
      alert("Course updated successfully");
      if (onSubmit) {
          onSubmit();
      }
      } catch (error) {
          console.error("Failed to update course: ", error);
          alert("Failed to update course");
      }
  };

  return (
    <div className="flex">
        <div className="w-1/4 bg-white p-4 shadow-md rounded-lg mr-6">
            
            <Searchbar placeholder="Search students or teachers..." onSearch={handleSearch} />

            <div className="mt-6 max-h-64 overflow-y-auto">
                <h4>Students:</h4>
                {searchResultsStudents.map(student => (
                    <div
                        key={student.user_id}
                        onClick={() => addStudentToCourse(student)}
                        className="cursor-pointer p-2 hover:bg-blue-100 rounded border mt-2"
                    >
                        {student.full_name}
                    </div>
                ))}
            </div>

            <div className="mt-6 max-h-64 overflow-y-auto">
                <h4>Teachers:</h4>
                {searchResultsTeacher.map(teacher => (
                    <div
                        key={teacher.user_id}
                        onClick={() => addTeacherToCourse(teacher)}
                        className="cursor-pointer p-2 hover:bg-green-100 rounded border mt-2"
                    >
                        {teacher.full_name}
                    </div>
                ))}
            </div>
        </div>

        <div className="w-3/4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Course Name"
                        className="form-input p-3 border rounded-lg w-full"
                        required
                    />
                    <select
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="form-input p-3 border rounded-lg w-full"
                        required
                    >
                        <option value="">Select Term</option>
                        {terms.map(term => (
                            <option key={term.term_id} value={term.term_id}>
                                {term.term_name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={classroom}
                        onChange={(e) => setClassroom(e.target.value)}
                        placeholder="Classroom"
                        className="form-input p-3 border rounded-lg w-full"
                        required
                    />
                </div>

                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Students in course</h3>
                        {selectedStudents.map(student => (
                            <NameCard
                                key={student.user_id}
                                person={student}
                                onRemove={() => removeStudentFromCourse(student.user_id)}
                            />
                        ))}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Teachers in course</h3>
                        {selectedTeachers.map(teacher => (
                            <NameCard
                                key={teacher.user_id}
                                person={teacher}
                                onRemove={() => removeTeacherFromCourse(teacher.user_id)}
                            />
                        ))}
                    </div>
                </div>

                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Save Edit
                </button>
            </form>
        </div>
    </div>
  );
};

export default EditCourseForm;
