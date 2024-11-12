import React from "react";
import XButton from "./XButton";

const StudentCard = ({ student, onRemove }) => {
    return (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2 shadow-sm">
            <span>{student.name} - {student.id}</span>
            <XButton onClick={() => onRemove(student.id)}/>
        </div>
    );
}

export default StudentCard;