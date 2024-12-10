import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import xIcon from "../../../assets/User_Screen/xIcon.svg";

const MaterialForm = ({ 
  courseId, 
  moduleId, 
  uploaderId, 
  material,
  isEdit = false, 
}) => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [materialType, setMaterialType] = useState("document");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("public");

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && material) {
      setTitle(material.title);
      setMaterialType(material.material_type);
      setFile(material.file);
      setStatus(material.status);
    }
  }, [isEdit, material]);

  
  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    setSelectedFile(newFile);
    if (!title && newFile) {
      setTitle(newFile.name);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      let uploadedFile = null;
      //nếu có file được chọn
      if (selectedFile) {
        // xóa file cũ trên s3 nếu ở mode edit và có file mới được chọn
        if (isEdit && selectedFile.name !== material.file.file_name) {
          console.log("deleting file", material.file.file_path);
          await axios.post("/api/delete-files", { keys: [material.file.file_path] });
        }
        // upload file mới lên s3 nếu ở mode add hoặc ở mode edit có file mới được chọn
        const formData = new FormData();
        formData.append("folder", "materials/" + courseId + "/" + moduleId);
        formData.append("files", selectedFile);
        
        const uploadResponse = await axios.post("/api/upload-files", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.data &&
          uploadResponse.data.uploadedFiles &&
          uploadResponse.data.uploadedFiles[0]
        ) {
          uploadedFile = uploadResponse.data.uploadedFiles[0];
          console.log("uploadedFile", uploadedFile);
        } else {
          throw new Error("Failed to upload file");
        }

      }

      const materialData = {
        uploaderId,
        moduleId,
        title,
        materialType,
        status,
        file: uploadedFile // Dùng file mới hoặc giữ file cũ
      }

      if (isEdit) {
        console.log("materialData", materialData);
        await axios.put(`/api/materials/edit/${material.material_id}`, materialData);
        navigate(`/teacher/courses/${courseId}`);
      } else {
        const response = await axios.post("/api/materials/add", materialData);
        if (response.status === 201) {
          navigate(`/teacher/courses/${courseId}`);
        }
      }

    } catch (error) {
      console.error(error);
      setError("There was an error processing the material.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="material-form px-10">
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <label className="font-semibold text-lg p-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title or leave blank to use file name.."
            className="w-full p-2"
          />
        </div>

        <div>
          <label className="font-semibold text-lg p-1">Material Type:</label>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            required
          >
            <option value="document">Document</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
            <option value="zip">ZIP</option>
          </select>
        </div>

        <div className="flex">
          <label className=" text-lg p-1">Status:</label>
          <div className="flex">
            <div className="flex items-center me-4">
              <input 
                id="public" 
                type="radio" 
                value="public" 
                name="status"
                checked={status === "public"}
                onChange={() => setStatus("public")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Public</label>
            </div>
            <div className="flex items-center me-4">
              <input 
                id="private" 
                type="radio" 
                value="private" 
                name="status" 
                checked={status === "private"}
                onChange={() => setStatus("private")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
              <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Private</label>
            </div>
          </div>
        </div>

        {isEdit && (
          <div className="flex items-center">
            <label className="font-semibold text-lg p-1">Current File:</label>
            <div className="flex items-center">
              <a href={material.file.file_path} target="_blank" rel="noreferrer" className="text-blue-500 underline">{material.file.file_name}</a>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <label className="font-semibold text-lg p-1">
            {isEdit ? "New File:" : "File Attachement:"}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            required={!isEdit} // Chỉ bắt buộc nếu thêm mới
            className="text-blue-500 underline"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="mt-10 justify-items-end">
          <button type="submit" disabled={loading} 
            className="text-white bg-blue-700 rounded-2xl p-2">
            {loading ? (isEdit ? "Updating..." : "Uploading...") : (isEdit ? "Update Material" : "+ Material")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;
