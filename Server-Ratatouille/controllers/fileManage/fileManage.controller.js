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
  
 
  getObjectUrl: async (req, res) => {
    try {
      const key = req.params.key;
  
      // Kiểm tra key có được truyền không
      if (!key) {
        return res.status(400).json({ message: "Key is required" });
      }
  
      // Tạo URL truy cập tạm thời cho đối tượng trong S3
      const url = await s3.getObject(key);
  
      // Trả về URL thành công
      res.status(200).json({ url });
    } catch (error) {
      console.error("Error in getObjectUrl:", error);
  
      // Xử lý lỗi không tồn tại key
      if (error.name === "NotFound" || error.message.includes("NoSuchKey")) {
        return res.status(404).json({ message: `File not found: ${req.params.key}` });
      }
  
      // Xử lý lỗi không xác định
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },

  // getFiles: async (req, res) => { // đang bug
  //   try {
  //     const { prefix } = req.params;
      
  //     // Gửi yêu cầu để liệt kê các đối tượng với prefix đã chỉ định
  //     const response = await s3.listObjects(prefix);
  
  //     // Kiểm tra nếu không có đối tượng nào được tìm thấy
  //     if (!response.objects || response.objects.length === 0) {
  //       return res.status(404).json({ message: "Không tìm thấy tệp nào với prefix được cung cấp" });
  //     }
  
  //     // Trả về danh sách các đối tượng đã tìm thấy
  //     return res.status(200).json({ objects: response.objects });
  //   } catch (error) {
  //     // Ghi lỗi và trả về thông báo lỗi
  //     console.error("Lỗi khi lấy tệp:", error);
  //     return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  //   }
  // },
  

  // deleteFiles: async (req, res) => {  đang bug
  //   try {
  //     const { keys } = req.body; // Nhận danh sách keys từ body (mảng các keys cần xóa)
      
  //     if (!keys || keys.length === 0) {
  //       return res.status(400).json({ message: "No file keys provided" });
  //     }

  //     // Xóa từng file và kiểm tra kết quả
  //     const results = await Promise.all(
  //       keys.map(async (key) => {
  //         try {
  //           await s3.deleteObject(key); // Gọi hàm deleteObject từ s3
  //           return { key, message: "File deleted successfully" };
  //         } catch (error) {
  //           return { key, message: "Error deleting file", error: error.message };
  //         }
  //       })
  //     );

  //     // Trả về kết quả xóa
  //     res.status(200).json({ results });
  //   } catch (error) {
  //     console.error("Error deleting files:", error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }
  
  


};

export default fileManageController;
