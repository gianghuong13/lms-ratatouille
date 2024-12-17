import React, { useState, useEffect } from "react";
import ModuleItem from "./ModuleItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import triangleicon from "../assets/User_Screen/dropdown.svg";
import ModuleEditOptions from "./ModuleEditOptions";
import AddItemOptions from "./AddItemOptions";
import EditModuleForm from "../features/teacher/ModuleManage/EditModuleForm";

const ModuleTitle = ({ 
  moduleId,
  moduleName, 
  moduleDescription, 
  materials = [], 
  assignments = [],
  courseId, 
  role, 
  onDeleteModule,
  onModuleUpdate,
  onFetchMaterials,
  onFetchAssignments,
}) => {

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    module_name: moduleName,
    description: moduleDescription,
  });
  
 
  const toggleDropdown = () => {
      setIsOpen((prevState) => !prevState);
      if (!isOpen) {
        onFetchMaterials();
        onFetchAssignments();
      }
  };

  const handleEditModule = async () => {
    try {
        console.log(updatedData);
        const response = await axios.put(`/api/modules/edit/${moduleId}`, {
            module_name: updatedData.module_name,
            description: updatedData.description,
        });
        if (response.status === 200) {
            onModuleUpdate(moduleId, updatedData);
            setShowForm(false);
        } else {
            setError('Failed to edit module');
        }
    } catch (error) {
      console.error('Error editing module:', error);
        setError('Failed to edit module');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
  };

  const handleDeleteMaterial = async (materialId, materialFilePath) => {
    try {
      console.log(materialId);
      if (materialFilePath) {
        const deleteResponse = await axios.post('/api/delete-files', { keys: [materialFilePath] });
        if (deleteResponse.status !== 200) {
          setError('Failed to delete file from s3');
          console.error('Failed to delete file from s3', deleteResponse.data);
          return;
        }
        console.log('File deleted from s3 successfully');
      }

      const response = await axios.delete(`/api/materials/delete/${materialId}`);
      if (response.status === 200) {
        onFetchMaterials();
      } else {
        setError('Failed to delete material');
      }
    } catch (error) {
      setError('Error deleting material');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const response = await axios.get(`/api/assignment/get-assignment-filepath/${assignmentId}`);

      if (response.data && Array.isArray(response.data.filePaths) && response.data.filePaths.length > 0) {
        const filePaths = response.data.filePaths;
        console.log("Files to delete:", filePaths);
        
        try {
          await axios.post('/api/delete-files', { filePaths });
          console.log('Files deleted from S3 successfully');
        } catch (error) {
          console.error("Error deleting files from S3:", error);
        }
  
        try {
          await axios.delete(`/api/assignment/delete-assignment-file/${assignmentId}`);
          console.log('Files deleted from assignment_files table');
        } catch (error) {
          console.error("Error deleting assignment files from DB:", error);
        }

      } else {
        console.log("No files to delete or invalid data format.");
      }
      
      try {
        await axios.delete(`/api/assignment/delete-assignment/${assignmentId}`);
        onFetchAssignments();
        
      } catch (error) {
        console.error("Error deleting assignment:", error); 
      }
    } catch (error) {
      console.error("Error fetching assignment files:", error);
    }
  };

  return (
    <>
      <div className="flex justify-between bg-gray-200 shadow rounded-lg p-4 mt-10 w-full">
          <div className="flex items-baseline cursor-pointer" onClick={toggleDropdown}>
            <div className="mr-4">
              <img src={triangleicon} alt="" className={`transform transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}/>
            </div>
            <h3 className="text-xl font-semibold">{moduleName}</h3>
          </div>

          <div className="flex items-center space-x-2">
            
            {role === 'teacher' && (
                    <>
                      <ModuleEditOptions onEdit={() => setShowForm(true)} onDelete={() => onDeleteModule(moduleId)} />
                      <AddItemOptions 
                        onAddMaterial={() => navigate(`/teacher/courses/${courseId}/modules/${moduleId}/add-material`)} 
                        onAddAssignment={() => navigate(`/teacher/courses/${courseId}/modules/${moduleId}/add-assignment`)} 
                      />
                    </>
            )}
            
          </div>        
      </div>

      
      {isOpen && (
        <div className="module-items p-2 bg-gray-100 rounded-lg">
          {!materials.length && !assignments.length ? (
            <p>No materials or assignments available</p>
          ) : (
            <>
              {materials.length > 0 && (
                <div className="materials">
                  {materials.map((material) => (
                    <ModuleItem 
                      key={material.material_id} 
                      item={material}
                      itemType="material"
                      role={role}
                      courseId={courseId}
                      moduleId={moduleId}
                      onDelete={() => handleDeleteMaterial(material.material_id, material.files[0]?.file_path)}
                    />
                  ))}
                </div>
              )}

              {assignments.length > 0 && (
                <div className="assignments">
                  {assignments.map((assignment) => (
                    <ModuleItem 
                      key={assignment.assignment_id} 
                      item={assignment}
                      itemType="assignment"
                      role={role}
                      courseId={courseId}
                      moduleId={moduleId}
                      onDelete={() => handleDeleteAssignment(assignment.assignment_id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        
      )}

      {showForm && (
        <EditModuleForm
          moduleData={
            updatedData
          }
          onSubmit={handleEditModule}
          onCancel={() => setShowForm(false)}
          onFormChange={handleInputChange}
        />
      )}

      
    </>
  );
};

export default ModuleTitle;
