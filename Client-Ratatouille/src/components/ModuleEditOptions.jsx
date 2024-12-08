import React, { useState, useRef, useEffect } from "react";
import dots from "../assets/User_Screen/EditDots.svg";
import editIcon from "../assets/User_Screen/Edit.svg";
import trashbinIcon from "../assets/User_Screen/Trashbin.svg";

const ModuleEditOptions = ({ onEdit, onDelete }) => {
    const [isVisible, setIsVisible] = useState(false);
    const menuRef = useRef();

    const toggleMenu = () => {
        setIsVisible((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={toggleMenu}>
                <img src={dots} alt="Options" />
            </button>
            {isVisible && (
                <div
                    className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border border-gray-200 z-10"
                >
                    
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 w-full px-2 py-2 text-left text-gray-800 hover:bg-gray-200"
                    >
                        <img src={editIcon} alt="" />
                        Edit Module
                    </button>
                    
        
                    <button
                        onClick={onDelete}
                        className="flex items-center gap-2 w-full px-2 py-2 text-left text-red-500 hover:bg-gray-200"
                    >
                        <img src={trashbinIcon} alt="" />
                        Delete Module
                    </button>
                </div>
            )}
        </div>
    );
};

export default ModuleEditOptions;
