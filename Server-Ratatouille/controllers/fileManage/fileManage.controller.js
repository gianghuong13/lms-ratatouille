import s3 from "../../utils/s3.js";
import upload from "../../middleware/upload.middleware.js";

const fileManageController = {
  // Upload multiple files
  uploadFiles: async (req, res) => {
    try {
      const files = req.files; // Get an array of files from the request
      const folder = req.body.folder || "upload"; // Default folder if not specified

      if (!files || files.length === 0) {
        return res.status(400).json({
          message: "No files were uploaded",
        });
      }

      // Upload each file and store the result
      const results = await Promise.all(
        files.map(async (file) => {
          const { signedUrl, key } = await s3.generateUploadUrl(
            file.originalname,
            file.mimetype,
            folder
          );
          await s3.putObject(signedUrl, file.buffer); // Upload file
          return { fileName: file.originalname, key }; // Store uploaded file information
        })
      );

      res.status(200).json({
        message: "Files uploaded successfully",
        uploadedFiles: results, // List of uploaded files
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },

  // Generate a temporary URL to access a file
  getObjectUrl: async (req, res) => {
    try {
      const {key} = req.body;
      if (!key) {
        return res.status(400).json({ message: "Key is required" });
      }
  
      const url = await s3.getObject(key); 
      res.status(200).json({ url });
    } catch (error) {
      console.error("Error in getObjectUrl:", error);
  
      if (error.name === "NotFound" || error.message.includes("NoSuchKey")) {
        return res.status(404).json({ message: `File not found: ${req.params.key}` });
      }
  
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  

  // List all files in a folder
  getFiles: async (req, res) => {
    try {
      const { prefix } = req.params;

      const response = await s3.listObjects(prefix);

      if (!response || response.length === 0) {
        return res.status(404).json({ message: "No files found with the provided prefix" });
      }

      res.status(200).json({ files: response }); // Return the list of files
    } catch (error) {
      console.error("Error listing files:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Delete multiple files
  deleteFiles: async (req, res) => {
    try {
        const { keys } = req.body; // Mảng các keys cần xóa

        // Kiểm tra đầu vào
        if (!Array.isArray(keys) || keys.length === 0) {
            return res.status(400).json({ message: "No file keys provided" });
        }

        // Xóa từng tệp từ S3
        const results = await Promise.all(
            keys.map(async (key) => {
                try {
                    await s3.deleteObject(key); // Gọi hàm deleteObject đã cải tiến
                    return { key, message: "File deleted successfully" };
                } catch (error) {
                    console.error(`Error deleting file ${key}:`, error);
                    return { key, message: "Error deleting file", error: error.message };
                }
            })
        );

        // Kiểm tra xem có lỗi xảy ra trong quá trình xóa
        const hasErrors = results.some((result) => result.error);
        if (hasErrors) {
            return res.status(207).json({
                message: "Some files could not be deleted",
                results,
            }); // Trả về trạng thái 207 (Multi-Status) nếu có lỗi
        }

        // Nếu tất cả đều xóa thành công
        res.status(200).json({
            message: "All files deleted successfully",
            results,
        });
    } catch (error) {
        console.error("Error deleting files:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
},



};

export default fileManageController;
