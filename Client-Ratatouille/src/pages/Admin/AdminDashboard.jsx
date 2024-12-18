import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WelcomCard from '../../components/WelcomCard';
import PageTitle from '../../components/PageTitle';
import CreateTermForm from '../../features/admin/CourseManage/CreateTermForm';

const AdminDashboard = () => {
  const [courseCounts, setCourseCounts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCourseCounts = async () => {
      try {
        const response = await axios.post('api/courses/count-course-by-term');
        setCourseCounts(response.data);
      } catch (error) {
        console.error('Error fetching course counts:', error);
      }
    };

    fetchCourseCounts();
  }, []);

  const handleCreateTermClick = () => {
    setShowForm(true);
  };

  const handleTermCreated = (newTerm) => {
    setCourseCounts((prevCourseCounts) => [...prevCourseCounts, newTerm]);
    setShowForm(false);
  };

  return (
    <div className="bg-[#F5F8FB] flex-1">
      <WelcomCard />
      <PageTitle title="Dashboard" />
      <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Term</th>
              <th className="py-2 px-4 border-b text-center">Number of Courses</th>
            </tr>
          </thead>
          <tbody>
            {courseCounts.map((term) => (
              <tr key={term.term_name}>
                <td className="py-2 px-4 border-b text-center">{term.term_name}</td>
                <td className="py-2 px-4 border-b text-center">{term.total_courses}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button 
            className="text-white bg-[#015DAF] hover:bg-[#397bfe] font-medium rounded-full px-5 py-2"
            onClick={handleCreateTermClick}
          >
            Create Term
          </button>
        </div>
        {showForm && (
          <div className="flex justify-center mt-4">
            <CreateTermForm onTermCreated={handleTermCreated} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
