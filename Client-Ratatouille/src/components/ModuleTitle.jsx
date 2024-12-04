import React, { useState, useEffect } from "react";
import ModuleItem from "./ModuleItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import triangleicon from "../assets/User_Screen/dropdown.svg";
import dots from "../assets/User_Screen/EditDots.svg";
import pluscircle from "../assets/User_Screen/PlusCircle.svg";

const ModuleTitle = ({ moduleId, moduleName, materials, courseId }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
 
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // const handleDeleteModule = () => {
  //   if (window.confirm("Are you sure you want to delete this module?")) {
  //     onDelete(moduleId);
  //   }
  // };

  return (
    <>
      <div className="flex justify-between bg-gray-200 shadow rounded-lg p-4 mt-14 w-full">
          <div className="flex items-baseline cursor-pointer" onClick={toggleDropdown}>
            <div className="mr-4">
              <img src={triangleicon} alt="" className={`transform transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}/>
            </div>
            <h3 className="text-xl font-semibold">{moduleName}</h3>
          </div>

          <div className="flex items-baseline space-x-2">
            <img src={dots} alt="editdots" onClick={() => navigate(``)} className="cursor-pointer"/>
            <img src={pluscircle} alt="addplus" onClick={() => navigate(`/teacher/courses/${courseId}/modules/${moduleId}/add-material`)} className="cursor-pointer"/>
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

      {/* <button
        onClick={handleDeleteModule}
        className="delete-module-btn p-2 bg-red-500 text-white rounded mt-4"
      >
        Delete Module
      </button> */}
    </>
  );
};

export default ModuleTitle;
