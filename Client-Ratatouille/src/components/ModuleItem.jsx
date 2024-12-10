import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ModuleEditOptions from "./ModuleEditOptions";
import clip from "../assets/User_Screen/Clip.svg";
import linkIcon from "../assets/User_Screen/linkIcon.svg";
import videoIcon from "../assets/User_Screen/videoIcon.svg";
import zipIcon from "../assets/User_Screen/zipIcon.svg";

const ModuleItem = ({ courseId, role, moduleId, material, onDeleteMaterial }) => {

  const navigate = useNavigate();

  const { title, material_type, files } = material;

  // const renderFiles = () => {
  //   // Check if files is an array and has elements
  //   if (Array.isArray(files) && files.length > 0) {
  //     return files.map((file) => (
  //       <div key={file.file_id} className="file-item">
  //         <a 
  //           href={`/${file.file_path}`}  // Assuming the file_path is relative to the server root
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="text-blue-500 hover:underline"
  //         >
  //           {file.file_name}
  //         </a>
  //       </div>
  //     ));
  //   } else {
  //     return <div>No items available</div>;
  //   }
  // };

  const getFileUrl = () => {
    if (files && files.length > 0) {
      return files[0].file_path; // file_path là URL của file trong danh sách files
    }
    return null;
  };

  const fileUrl = getFileUrl();

  const onEditMaterial = (materialId) => {
    navigate(`/teacher/courses/${courseId}/modules/${moduleId}/material-items/${materialId}/edit`);
  };

  return (
    <div className="flex justify-between module-item p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex items-center">

        {material_type === 'document' && (
          <div className="mr-1">
            <img src={clip} alt="clip" className="h-4 w-4 inline-block mr-1" />
          </div>
        )}
        {material_type === 'video' && (
          <div className="mr-1">
          <img src={videoIcon} alt="clip" className="h-4 w-4 inline-block mr-1" />
        </div>
        )}
        {material_type === 'link' && (
          <div className="mr-1">
            <img src={linkIcon} alt="link" className="h-4 w-4 inline-block mr-1" />
          </div>
        )}
        {material_type === 'zip' && (
          <div className="mr-1">
            <img src={zipIcon} alt="zip" className="h-4 w-4 inline-block mr-1" />
          </div>
        )}

        

        <div className="flex justify-between items-center">
          {/* <div className="font-semibold" href="">{title}</div> */}
          {/* <div className="material-files mt-2">
            {renderFiles()}
          </div> */}
          <a 
            href={fileUrl}  // Assuming the file_path is relative to the server root
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:underline font-semibold text-lg"
          >
            {title}
          </a>
        </div>
      </div>
      {role === 'teacher' && (
        <div>
          <ModuleEditOptions 
            onEdit={() => onEditMaterial(material.material_id)} 
            onDelete={onDeleteMaterial}/>
        </div>
      )}
    </div>
    
  );
};

export default ModuleItem;
