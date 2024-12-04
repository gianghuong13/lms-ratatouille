import express from 'express';
import materialManageController from '../../controllers/materialManage/materialManage.controller.js';

const router = express.Router();

router.get('/materials/:course_id', materialManageController.getMaterialsByCourse);
router.post('/materials/add', materialManageController.createMaterial);

export default router;