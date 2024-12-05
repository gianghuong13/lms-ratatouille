import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMaterialForm = ({ courseId, moduleId, uploaderId }) => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [materialType, setMaterialType] = useState("document");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Handle file selection
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  // Submit form data to the server
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Upload the files to S3
      const formData = new FormData();
      formData.append("folder", "materials/"+courseId+"/"+moduleId); // Set folder name if needed

      // Append files to formData
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const uploadResponse = await axios.post("/api/upload-files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedFiles = uploadResponse.data.uploadedFiles;

      // Step 2: Send material information and file URLs to the backend
      const materialData = {
        // courseId,
        uploaderId,
        moduleId,
        title,
        materialType,
        files: uploadedFiles, // Include file info (e.g., file name and key)
      };

      const materialResponse = await axios.post("/api/materials/add", materialData);

      if (materialResponse.status === 201) {
        navigate(`/teacher/courses/${courseId}`);
      }
    } catch (err) {
      console.error(err);
      setError("There was an error uploading the material.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-material-form">
      <h2>Add New Material</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Material Type:</label>
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

        <div>
          <label>Upload Files:</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Material"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMaterialForm;
