import express from 'express';
import materialManageController from '../../controllers/materialManage/materialManage.controller.js';

const router = express.Router();

router.get('/materials/:course_id', materialManageController.getMaterialsByCourse);
router.post('/materials/add', materialManageController.createMaterial);
router.get('/materials/module/:module_id', materialManageController.getMaterialsByModule);

export default router;