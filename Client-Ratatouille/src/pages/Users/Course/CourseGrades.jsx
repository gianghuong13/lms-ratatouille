import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CourseGrades = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        let response;
        if (role === "teacher") {
          response = await axios.get(`/api/assignment/get-assignment-info/${courseId}`);
        } else if (role === "student") {
          response = await axios.get(`/api/assignment/get-assignments-and-grades/${courseId}/${userId}`);
        }
        setAssignments(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching assignments");
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [courseId, role, userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout>
      <div className="px-2 sm:mx-2 rounded-2xl h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
        <div className="w-full bg-white p-5">
          <h3 className="m-0 font-semibold text-lg" style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>Grades</h3>
          <div className="overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-3">Assignment Name</th>
                  <th className="py-3">Due Date</th>
                  <th className="py-3">{role === "teacher" ? "Grading" : "Grade"}</th>
                  {role === "student" && <th className="py-3">Submission</th>}
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-b">
                    <td className="py-3">{assignment.title}</td>
                    <td className="py-3">{assignment.due_date}</td>
                    {role === "teacher" ? (
                      <td className="py-3">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => navigate(`/teacher/courses/${courseId}/assignments/${assignment.assignment_id}/grading`)}
                        >
                          Grading
                        </button>
                      </td>
                    ) : (
                      <>
                        <td className="py-3">{assignment.grade}</td>
                        <td className="py-3">
                          <a
                            href={`/student/courses/${courseId}/assignments/${assignment.assignment_id}/submissions/${assignment.submission_id}`}
                            className="text-blue-500 hover:underline"
                          >
                            View Submission
                          </a>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseGrades;