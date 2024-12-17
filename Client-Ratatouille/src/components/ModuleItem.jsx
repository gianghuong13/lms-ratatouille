import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ModuleEditOptions from "./ModuleEditOptions";
import clip from "../assets/User_Screen/Clip.svg";
import linkIcon from "../assets/User_Screen/linkIcon.svg";
import videoIcon from "../assets/User_Screen/videoIcon.svg";
import zipIcon from "../assets/User_Screen/zipIcon.svg";
import assignmentIcon from "../assets/User_Screen/Assignment.svg";

const ModuleItem = ({ courseId, role, moduleId, item, itemType, onDelete }) => {

  const navigate = useNavigate();

  let title, material_type, files, status, due_date;

  if (itemType === 'material') {
    ({ title, material_type, files, status } = item);
  } else if (itemType === 'assignment') {
    ({ title, due_date } = item);
  }

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
      if (material_type === 'link') {
        return files[0].file_path;
      }
      let url = btoa(files[0].file_path); // Encode file path using Base64
      url = `/${role}/courses/${courseId}/files/${url}`;
      return url;
    }
    return null;
  };

  const fileUrl = getFileUrl();

  const onEditItem = () => {
    const route = 
      itemType === 'material'
        ? `/teacher/courses/${courseId}/modules/${moduleId}/material-items/${item.material_id}/edit`
        : `/teacher/courses/${courseId}/assignments/${item.assignment_id}/edit`;
    navigate(route);
  };

  if (role === 'student' && status === 'private') {
    return null;
  }

  return (
    <div className="flex justify-between module-item p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex items-center">
        {/* icon */}
        {itemType === 'material' && (
          <>
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
                <img src={linkIcon} alt="link" className="h-6 w-6 inline-block" />
              </div>
            )}
            {material_type === 'zip' && (
              <div className="mr-1">
                <img src={zipIcon} alt="zip" className="h-4 w-4 inline-block mr-1" />
              </div>
            )}
          </>
        )}

        {itemType === 'assignment' && (
          <div className="mr-1">
            <img src={assignmentIcon} alt="assignment" className="h-6 w-6 inline-block mr-1" />
          </div>
        )}

        {/* title */}
        {itemType === 'material' && (
          <a 
            href={fileUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:underline font-semibold text-lg"
          >
            {title}
          </a>
        )}
        
        {itemType === 'assignment' && (
          <div>
            <Link 
              to={`/${role}/courses/${courseId}/assignments/${item.assignment_id}`} 
              target="_blank"
              className="text-gray-700 hover:underline font-semibold text-lg"
            >
              {title}
            </a>
          )}
          
          {itemType === 'assignment' && (
            <div>
              <Link 
                to={`/${role}/courses/${courseId}/modules/${moduleId}/assignments/${item.assignment_id}`} 
                target="_blank"
                className="text-gray-700 hover:underline font-semibold text-lg"
              >
                {title}
              </Link>
              <div className="text-gray-500 text-xs">
                Due: {new Date(due_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        
      </div>

      {role === 'teacher' && (
        <div>
          <ModuleEditOptions 
            onEdit={onEditItem} 
            onDelete={() => onDelete(itemType === 'material' ? item.material_id : item.assignment_id)}
          />
        </div>
      )}
    </div>
    
  );
};

export default ModuleItem;
