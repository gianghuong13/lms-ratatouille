import React, { useState, useEffect } from "react";
import ModuleItem from "./ModuleItem";
import axios
 from "axios";
const ModuleTitle = ({ moduleName, moduleId }) => {
    const [isOpen, setIsOpen] = useState(false);
    // const [items, setItems] = useState([]);
    const [materials, setMaterials] = useState([]);

    const toggleDropdown = () => {
        setIsOpen(prevState => !prevState);
    };

    // const fetchItems = () => {
    //     try {
    //         const materialItems = await fetch(/api/materials?module)
    //     }
    // };

    useEffect(() => {
        fetchMaterials();
    }, [moduleId]); 

    const fetchMaterials = async () => {
        try {
            const response = await axios.get(`/api/materials?module=${moduleId}`);
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };



  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
      {/* Module Title with dropdown icon */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <h3 className="text-xl font-semibold">{moduleName}</h3>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </div>

      {/* Module Items (shown when the dropdown is open) */}
      {isOpen && (
        <ul className="mt-3 space-y-2 pl-4">
          {materials.map((material) => (
            <li key={material.material_id}>
              <ModuleItem material={material} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ModuleTitle;