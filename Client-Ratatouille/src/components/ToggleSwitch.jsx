import React from "react";

export default function ToggleSwitch({ selected, setSelected }) {
  return (
    <div className="flex w-48 bg-blue-200 rounded-full">
      <button
        className={`flex-1 text-center py-2 rounded-full transition-all ${
          selected === "Student" ? "bg-blue-600 text-white" : "text-black"
        }`}
        onClick={() => setSelected("Student")}
      >
        Student
      </button>
      <button
        className={`flex-1 text-center py-2 rounded-full transition-all ${
          selected === "Teacher" ? "bg-blue-600 text-white b" : "text-black"
        }`}
        onClick={() => setSelected("Teacher")}
      >
        Teacher
      </button>
    </div>
  );
}
