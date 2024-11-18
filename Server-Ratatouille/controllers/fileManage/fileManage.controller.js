import connection from "../../database/dbConnect.js";
import s3 from "../../utils/s3.js";
import multer from "multer";
const fileManageController = {
    uploadFile: async (req, res) => {  
        try {
            const file = req.file;
            const url = await s3.generateUploadUrl(file.originalname, file.mimetype);
            const response =s3.putObject(url, file.buffer);
            res.status(200).json({
                message: "File uploaded successfully",
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }
}

export default fileManageController;