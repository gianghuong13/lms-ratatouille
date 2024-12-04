import React from "react";
import { Link } from "react-router-dom";

const ModuleItem = ({ material }) => {
  const { material_id, title, material_type, files } = material;

  return (
    <li className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{material_type}</p>
      </div>
      
      {/* Displaying a link for each file related to this material */}
      {files && files.length > 0 && (
        <div className="flex space-x-2">
          {files.map((file) => (
            <a
              key={file.file_id}
              href={file.file_path} // Assuming file_path contains the URL or file link
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {file.file_name}
            </a>
          ))}
        </div>
      )}
    </li>
  );
};

export default ModuleItem;
