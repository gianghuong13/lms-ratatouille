import React from 'react';
import { useParams } from 'react-router-dom';

const FileDetail = () => {
  const { courseId, fileName } = useParams();
  const decodedFileName = decodeURIComponent(fileName.replace(/-/g, ' '));

  return (
    <div>
      <h1>File Detail</h1>
      <p>Course ID: {courseId}</p>
      <p>File Name: {decodedFileName}</p>
    </div>
  );
};

export default FileDetail;