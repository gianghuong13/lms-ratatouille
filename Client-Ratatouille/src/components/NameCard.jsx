import React from "react";
import XButton from "./XButton";

const NameCard = ({ person, onRemove }) => {
    return (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2 shadow-sm">
            <span>{person.full_name} - {person.user_id}</span>
            <XButton onClick={() => onRemove(person.user_id)}/>
        </div>
    );
}

export default NameCard;