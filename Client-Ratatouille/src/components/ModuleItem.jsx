import React from "react";
import { Link } from "react-router-dom";

const ModuleItem = ({ material }) => {
  const { title, material_type, files } = material;

  const renderFiles = () => {
    // Check if files is an array and has elements
    if (Array.isArray(files) && files.length > 0) {
      return files.map((file) => (
        <div key={file.file_id} className="file-item">
          <a 
            href={`/${file.file_path}`}  // Assuming the file_path is relative to the server root
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {file.file_name}
          </a>
        </div>
      ));
    } else {
      return <div>No files available</div>;
    }
  };

  return (
    <div className="module-item p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex justify-between items-center">
        {/* Material Title */}
        <div className="text-lg font-semibold">{title}</div>

        {/* Render material files */}
        <div className="material-files mt-2">
          {renderFiles()}
        </div>
      </div>

      {/* Optionally, handle other material types (like video, link, etc.) */}
      {material_type === 'document' && (
        <div className="text-sm text-gray-600 mt-2">Document</div>
      )}
      {material_type === 'video' && (
        <div className="text-sm text-gray-600 mt-2">Video</div>
      )}
      {/* You can add more material types as needed */}
    </div>
  );
};

export default ModuleItem;
