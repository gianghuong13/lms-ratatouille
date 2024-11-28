import React from "react";

const ModuleItem = ({ item }) => {
//   const { title, material_type, file_path, assignment_id, module_id } = item;
  const { title, material_type, file_path } = item;

  // Helper function to render material link based on type
  const renderMaterialLink = () => {
    switch (material_type) {
      case "document":
        return (
          <a href={file_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {title} (Document)
          </a>
        );
      case "video":
        return (
          <a href={file_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {title} (Video)
          </a>
        );
      case "link":
        return (
          <a href={file_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {title} (External Link)
          </a>
        );
      case "zip":
        return (
          <a href={file_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {title} (ZIP File)
          </a>
        );
      default:
        return <span>{title}</span>;
    }
  };

  // Function to render assignment link
//   const renderAssignmentLink = () => {
//     if (assignment_id) {
//       return (
//         <a href={`/assignments/${assignment_id}`} className="text-blue-600 hover:underline">
//           {title} (Assignment)
//         </a>
//       );
//     }
//     return null;
//   };

  return (
    <div className="p-4 mb-4 border rounded-lg shadow-sm">
      {/* Render material or assignment based on type */}
      {renderMaterialLink()}
      {/* {renderAssignmentLink()} */}
    </div>
  );
};

export default ModuleItem;
