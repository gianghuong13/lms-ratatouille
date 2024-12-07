import React, { useState, useEffect } from "react";
import ModuleItem from "./ModuleItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import triangleicon from "../assets/User_Screen/dropdown.svg";
import pluscircle from "../assets/User_Screen/PlusCircle.svg";
import ModuleEditOptions from "./ModuleEditOptions";
import AddItemOptions from "./AddItemOptions";
import EditModuleForm from "../features/teacher/ModuleManage/EditModuleForm";

const ModuleTitle = ({ moduleId, moduleName, moduleDescription, materials, courseId, role, onDeleteModule }) => {
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
  };

  const handleEditModule = async () => {
    try {
        console.log(updatedData);
        const response = await axios.put(`/api/modules/edit/${moduleId}`, {
            module_name: updatedData.module_name,
            description: updatedData.description,
        });
        if (response.status === 200) {
            console.log('Module edited successfully');
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


  return (
    <>
      <div className="flex justify-between bg-gray-200 shadow rounded-lg p-4 mt-10 w-full">
          <div className="flex items-baseline cursor-pointer" onClick={toggleDropdown}>
            <div className="mr-4">
              <img src={triangleicon} alt="" className={`transform transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}/>
            </div>
            <h3 className="text-xl font-semibold">{moduleName}</h3>
          </div>

          <div className="flex items-baseline space-x-2">
            
            {role === 'teacher' && (
                    <>
                      <ModuleEditOptions onEdit={() => setShowForm(true)} onDelete={() => onDeleteModule(moduleId)} />
                      {/* <img src={pluscircle} alt="addplus" onClick={() => navigate(`/teacher/courses/${courseId}/modules/${moduleId}/add-material`)} className="cursor-pointer"/> */}
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
          {materials.length === 0 ? (
            <p>No materials available</p>
          ) : (
            materials.map((material) => (
              <ModuleItem key={material.material_id} material={material} />
            ))
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
