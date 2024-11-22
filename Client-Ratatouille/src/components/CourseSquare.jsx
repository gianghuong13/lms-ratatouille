import React from "react";

const CourseCard = ({ title, image, description, code, semester, year }) => {
  return (
    <div className="max-w-xs rounded-lg shadow-lg overflow-hidden border bg-white">
      <div className="bg-blue-600 text-white text-center py-2 font-semibold text-lg">
        {title}
      </div>
      <div className="bg-blue-100 flex justify-center py-4">
        <img src={image} alt="Course Icon" className="w-16 h-16" />
      </div>
      <div className="p-4">
        <p className="font-semibold text-sm truncate">{description}</p>
        <p className="text-gray-500 text-xs mt-1">{code}</p>
        <p className="text-gray-500 text-xs">{semester} năm học {year}</p>
      </div>
      <div className="border-t px-4 py-2 flex justify-around text-blue-600 text-sm">
        <button className="hover:text-blue-800">
          <i className="fas fa-info-circle"></i>
        </button>
        <button className="hover:text-blue-800">
          <i className="fas fa-clipboard"></i>
        </button>
        <button className="hover:text-blue-800">
          <i className="fas fa-comments"></i>
        </button>
        <button className="hover:text-blue-800">
          <i className="fas fa-folder-open"></i>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
