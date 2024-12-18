import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GradingPage = () => {
  const { assignmentId,courseId } = useParams();
  console.log(courseId);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGrade, setEditingGrade] = useState(null);
  const [newGrade, setNewGrade] = useState('');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(`/api/submission/get-all/${assignmentId}`);
        setGrades(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching grades');
        setLoading(false);
      }
    };

    fetchGrades();
  }, [assignmentId]);

  const handleEditClick = (grade) => {
    if (grade.submission_id !== null) {
      setEditingGrade(grade);
      setNewGrade(grade.grade);
    }
  };

  const handleSaveClick = async () => {
    try {
      await axios.post(`/api/submission/grading/${editingGrade.submission_id}`, { grade: newGrade });
      setGrades((prevGrades) =>
        prevGrades.map((grade) =>
          grade.submission_id === editingGrade.submission_id ? { ...grade, grade: newGrade } : grade
        )
      );
      setEditingGrade(null);
      setNewGrade('');
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  };

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
                  <th className="py-3">Student ID</th>
                  <th className="py-3">Full Name</th>
                  <th className="py-3">Submission Date</th>
                  <th className="py-3">View Submission</th>
                  <th className="py-3">Grade</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.studentID} className="hover:bg-gray-50 border-b">
                    <td className="py-3">{grade.studentID}</td>
                    <td className="py-3">{grade.fullname}</td>
                    <td className="py-3">{grade.submission_date}</td>
                    <td className="py-3">
                      {grade.submission_id !== null ? (
                        <a href={`/teacher/courses/${courseId}/assignment/${assignmentId}/submissions/${grade.submission_id}`} className="text-blue-500 hover:underline">View</a>
                      ) : (
                        "none"
                      )}
                    </td>
                    <td className="py-3">
                      {editingGrade && editingGrade.submission_id === grade.submission_id ? (
                        <input
                          type="number"
                          value={newGrade}
                          onChange={(e) => setNewGrade(e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        grade.grade
                      )}
                    </td>
                    <td className="py-3">
                      {editingGrade && editingGrade.submission_id === grade.submission_id ? (
                        <button onClick={handleSaveClick} className="text-blue-500 hover:underline">Save</button>
                      ) : (
                        grade.submission_id !== null && (
                          <button onClick={() => handleEditClick(grade)} className="text-blue-500 hover:underline">Edit</button>
                        )
                      )}
                    </td>
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

export default GradingPage;