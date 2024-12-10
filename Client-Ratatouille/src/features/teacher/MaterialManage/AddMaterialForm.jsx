import React, { useState } from "react";
import MaterialForm from "./MaterialForm";

const AddMaterialForm = ({ courseId, moduleId, uploaderId }) => {
  return (
      <MaterialForm 
        courseId={courseId} 
        moduleId={moduleId} 
        uploaderId={uploaderId}
      />
  );
};

export default AddMaterialForm;
