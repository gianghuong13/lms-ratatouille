import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import Searchbar from '../../../components/Searchbar';
import axios from 'axios';
import WelcomCard from '../../../components/WelcomCard';
import PageTitle from '../../../components/PageTitle';

const CourseFiles = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const role = localStorage.getItem('role');

  // Fetch files from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prefix = `materials/${courseId}/`;
        const response = await axios.post('/api/list-files', { prefix });
        setFiles(response.data.files);
        setFilteredFiles(response.data.files); // Initially, filteredFiles is the same as files
        setLoading(false);
      } catch (err) {
        setError('Không có file nào được tìm thấy.');
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);


  // Handle file row click
  const handleRowClick = (fileKey) => {
    const encodedKey = btoa(fileKey); // Encode fileKey using Base64
    navigate(`/${role}/courses/${courseId}/files/${encodedKey}`);
  };

  return (
    <div className="bg-[#F5F8FB] flex-1"> 
      <WelcomCard />
      <PageTitle title="Courses" />
      <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
      <Layout>
      <div className="p-6">
        <h1 className="text-lg font-bold text-gray-700 mb-4">Files for Course {courseId}</h1>
        {/* Searchbar Component */}
        <Searchbar
          placeholder="Search files by name..."
          onSearch={(value) => {
            setSearchTerm(value); // Cập nhật từ khóa
            const filtered = files.filter((file) =>
              file.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredFiles(filtered); // Cập nhật danh sách đã lọc
          }}
        />
        {loading ? (
          <p className="text-gray-500 text-sm mt-4">Loading files...</p>
        ) : error ? (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-500 uppercase text-sm">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Type</th>
                  <th className="py-2 px-4">Size</th>
                  <th className="py-2 px-4">Last Modified</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(file.key)}
                    >
                      <td className="py-2 px-4">{file.name}</td>
                      <td className="py-2 px-4">{file.type.toUpperCase()}</td>
                      <td className="py-2 px-4">{(file.size / (1024 * 1024)).toFixed(2)} MB</td>
                      <td className="py-2 px-4">
                        {new Date(file.lastModified).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No files found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
      </div>
    </div>
  );
};

export default CourseFiles;
