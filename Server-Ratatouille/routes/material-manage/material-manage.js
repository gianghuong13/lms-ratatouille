import express from 'express';
import materialManageController from '../../controllers/materialManage/materialManage.controller.js';

const router = express.Router();

router.get('/materials', materialManageController.getMaterials);

export default router;