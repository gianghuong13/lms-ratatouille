import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import Layout from '../../../components/Layout';
import Searchbar from '../../../components/Searchbar';
import axios from 'axios';

const CourseFiles = () => {
  const { courseId } = useParams();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the prefix for the file path based on courseId
        const prefix = 'materials/' + courseId + '/';
        
        // Call the API using POST, passing the prefix in the body
        const deCodeRes = await axios.post('/api/list-files', { prefix });

        // Update the files state with the data returned from the API
        setFiles(deCodeRes.data.files);

        // Set loading to false since the data has been successfully fetched
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  console.log(files);
  // Hàm xử lý khi người dùng nhấn vào file
  const handleRowClick = (fileKey) => {
    // Replace all special characters with a hyphen before navigating
    const formattedKey = fileKey.replace(/[^a-zA-Z0-9]/g, '-');
    navigate(`/courses/${courseId}/files/${formattedKey}`);
  };
  

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-lg font-bold text-gray-700 mb-4">Files for Course {courseId}</h1>
        <Searchbar />
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
                  <th className="py-2 px-4">Size</th>
                  <th className="py-2 px-4">Last Modified</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {files.length > 0 ? (
                  files.map((file, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 cursor-pointer" 
                      onClick={() => handleRowClick(file.name)} // Xử lý khi nhấn vào dòng
                    >
                      <td className="py-2 px-4">{file.name}</td>
                      <td className="py-2 px-4">{(file.size / (1024 * 1024)).toFixed(2)} MB</td>
                      <td className="py-2 px-4">{new Date(file.lastModified).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
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
  );
};

export default CourseFiles;
