import s3 from "../../utils/s3.js";
import upload from "../../middleware/upload.middleware.js";

const fileManageController = {
  uploadFiles: async (req, res) => {
    try {
      const files = req.files; // Nhận mảng file từ request
      const folder = req.body.folder || "upload"; // Folder mặc định
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          message: "No files were uploaded",
        });
      }

      // Upload từng file và lưu kết quả
      const results = await Promise.all(
        files.map(async (file) => {
          const { signedUrl, key } = await s3.generateUploadUrl(
            file.originalname,
            file.mimetype,
            folder
          );
          await s3.putObject(signedUrl, file.buffer); // Upload file
          return { fileName: file.originalname, key }; // Lưu thông tin file đã upload
        })
      );

      res.status(200).json({
        message: "Files uploaded successfully",
        uploadedFiles: results, // Danh sách file đã upload
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },

  


};

export default fileManageController;
