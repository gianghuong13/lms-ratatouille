import React, { useState, useRef, useEffect } from "react";
import pluscircle from "../assets/User_Screen/PlusCircle.svg";
import assignment from "../assets/User_Screen/Assignment.svg";
import clip from "../assets/User_Screen/Clip.svg";

const AddItemOptions = ({ onAddMaterial, onAddAssignment }) => {
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
                <img src={pluscircle} alt="Options" />
            </button>
            {isVisible && (
                <div
                    className="absolute right-0 mt-2 w-60 bg-white shadow-md rounded-md border border-gray-200 z-10"
                >
                    
                    <button
                        onClick={onAddMaterial}
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-800 hover:bg-gray-200"
                    >
                        <img src={clip} alt="" />
                        Add Material
                    </button>
                    
        
                    <button
                        onClick={onAddAssignment}
                        className="flex items-center gap-2 w-full px-1 py-2 text-left text-gray-800 hover:bg-gray-200"
                    >
                        <img src={assignment} alt="" />
                        Add Assignment
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddItemOptions;
