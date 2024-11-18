import express from "express";
import fileManageController from "../../controllers/fileManage/fileManage.controller.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

// Route upload nhiều file
router.post("/upload-files", upload.array("files", 100),fileManageController.uploadFiles);
router.get("/object-url/:key", fileManageController.getObjectUrl);
// router.get("/list-objects/:prefix", fileManageController.getFiles);

// router.delete("/delete-object/:key", fileManageController.deleteFiles);

export default router;
