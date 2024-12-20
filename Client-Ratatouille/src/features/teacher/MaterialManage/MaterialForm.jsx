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
  const [file, setFile] = useState(null); // current file
  const [selectedFile, setSelectedFile] = useState(null); // new file
  const [status, setStatus] = useState("public");

  const [linkUrl, setLinkUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && material) {
      setTitle(material.title);
      setMaterialType(material.material_type);
      setFile(material.file);
      setStatus(material.status);
      if (material.material_type === "link" && material.file) {
        setLinkUrl(material.file.file_path);
      }
    }
  }, [isEdit, material]);

  
  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    setSelectedFile(newFile);
    if (!title && newFile) {
      setTitle(newFile.name);
    }
  };

  const handleMaterialTypeChange = (event) => {
    const selectedType = event.target.value;
    setMaterialType(selectedType);

    if (selectedType === "link") {
      setFile(null);
      setSelectedFile(null);
      setLinkUrl("");
    }

  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      let uploadedFile = null;
      
      if (materialType === "link") {
        uploadedFile = {fileName: title, key: linkUrl}
      }
      else if (selectedFile) {
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
        file: uploadedFile 
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
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5 w-2/3">
        <div className="flex justify-between">
          <label className="font-semibold text-lg p-1 mr-20">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title or leave blank to use file name.."
            className="bg-blue-200 border border-gray-300 rounded-md flex-1 ml-2 focus:outline focus:outline-2 focus:outline-[#D2DEF0] focus:border-[#015DAF] p-2 hover:border-[#015DAF]"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-lg p-1 mr-3">Material Type:</label>
          <select
            value={materialType}
            onChange={handleMaterialTypeChange}
            required
            className="bg-blue-200 w-32 border border-gray-300 rounded-md focus:outline focus:outline-2 focus:outline-[#D2DEF0] focus:border-[#015DAF] p-1 hover:border-[#015DAF]"
          >
            <option value="document">Document</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
            <option value="zip">ZIP</option>
          </select>
        </div>

        {materialType === "link" ? (
          <div className="flex items-center">
            <label className="font-semibold text-lg p-1 mr-20">URL:</label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter link URL"
              required
              className="bg-blue-200 border border-gray-300 rounded-md flex-1 ml-2 focus:outline focus:outline-2 focus:outline-[#D2DEF0] focus:border-[#015DAF] p-2 hover:border-[#015DAF]"
            />
          </div>
        ) : (
          <>
            {isEdit && file && (
              <div className="flex items-center">
                <label className="font-semibold text-lg p-1 mr-8">Current File:</label>
                <div className="flex items-center">
                  <a href={material.file.file_path} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                    {material.file.file_name}
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        {materialType !== "link" && (
          <div className="flex items-center">
            <label className="font-semibold text-lg p-1 mr-12">
              {isEdit ? "New File:" : "File Attachement:"}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              required={!isEdit} // Chỉ bắt buộc nếu thêm mới
              className="text-blue-500 underline"
            />
          </div>
        )}

        <div className="flex">
          <label className="font-semibold text-lg p-1 mr-16">Status:</label>
          <div className="flex space-x-3">
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

        {error && <p className="error">{error}</p>}
        <div className="flex items-center space-x-5">
        <div className="mt-14 justify-items-end">
          <button type="submit" disabled={loading} 
            className="text-white bg-blue-700 rounded-2xl p-2">
            {loading ? (isEdit ? "Updating..." : "Uploading...") : (isEdit ? "Save Edit" : "+ Material")}
          </button>
        </div>

        <div className="mt-14 justify-items-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/teacher/courses/${courseId}`)
            }}
            className="text-gray-700 bg-gray-400 rounded-2xl p-2"
          >
            Cancel
          </button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;
