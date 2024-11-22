import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
        setLoading(false);
        return;
      }
      const response = await axios.get(`/api/users-courses/${userId}`);
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Unable to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (courses.length === 0) {
    return <div>No courses found.</div>;
  }

  return (
    <div className="container">
      <h2 className="title">All Courses</h2>

      <div className="table-container">
        <table className="table is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>Course</th>
              <th>Term</th>
              <th>Enrolled as</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={`${course.course}-${course.enrolled_as}`}>
                <td>{course.course_name}</td>
                <td>{course.term_name}</td>
                <td>{course.enrolled_as}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesList;
