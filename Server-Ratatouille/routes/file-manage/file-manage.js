import express from "express";
import fileManageController from "../../controllers/fileManage/fileManage.controller.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

// Route to upload multiple files
router.post("/upload-files", upload.array("files", 100), fileManageController.uploadFiles);

// Route to get a temporary URL to access a file
router.get("/object-url/:key", fileManageController.getObjectUrl);

// Route to list all files in a specified folder
router.get("/list-files/:prefix", fileManageController.getFiles);

// Route to delete multiple files
router.delete("/delete-files", fileManageController.deleteFiles);

export default router;
