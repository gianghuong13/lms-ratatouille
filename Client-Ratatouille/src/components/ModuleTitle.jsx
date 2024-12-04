import React, { useState, useEffect } from "react";
import ModuleItem from "./ModuleItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import triangleicon from "../assets/User_Screen/dropdown.svg";
import dots from "../assets/User_Screen/EditDots.svg";
import pluscircle from "../assets/User_Screen/PlusCircle.svg";

const ModuleTitle = ({ courseId, moduleName, moduleId, onDelete }) => {

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleDeleteModule = () => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      onDelete(moduleId);
    }
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/materials?module=${moduleId}`);
        setMaterials(response.data);
      } catch (error) {
        setError("Error fetching materials. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, [moduleId]);

  return (
      <div className="flex justify-between bg-gray-300 shadow-lg rounded-lg p-4 mb-4 w-full">

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

        {/* Module Items (shown when the dropdown is open) */}
        {isOpen && (
          <div>
          <h2>Materials for Module {moduleId}</h2>
          {materials.length === 0 ? (
            <div>No materials found for this module.</div>
          ) : (
            <div>
              {materials.map((material) => (
                <div key={material.material_id}>
                  <h3>{material.title}</h3>
                  <p>Type: {material.material_type}</p>
                  <div>
                    {material.files.map((file, index) => (
                      <div key={index}>
                        <a href={file.file_path} target="_blank" rel="noopener noreferrer">
                          {file.file_name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
  );
};

export default ModuleTitle;
