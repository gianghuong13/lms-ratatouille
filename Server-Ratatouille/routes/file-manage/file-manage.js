import express from 'express';
import fileManageController from '../../controllers/fileManage/fileManage.controller.js';
import multer from 'multer';
const router = express.Router();
const upload = multer()

router.put('/upload',upload.single('file'),fileManageController.uploadFile);


export default router;