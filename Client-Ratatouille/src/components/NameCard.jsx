import React from "react";
import XButton from "./XButton";

const NameCard = ({ person, onRemove }) => {
    return (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2 shadow-sm">
            <span className="mr-3 text-sm">{person.user_id} - {person.full_name}</span>
            <div className="flex">
                <span className="border border-gray-300 rounded-lg bg-gray-300 p-0.5 mr-1 text-sm">{person.role}</span>
                <XButton onClick={() => onRemove(person.user_id)}/>
            </div>
            
        </div>
    );
}

export default NameCard;