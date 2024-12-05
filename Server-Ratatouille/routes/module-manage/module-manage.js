import express from 'express';
import moduleManageController from '../../controllers/moduleManage/moduleManage.controller.js';

const router = express.Router();

router.get('/modules/:course_id', moduleManageController.getModulesByCourse);
router.post('/modules/add', moduleManageController.addModule);
router.delete('/modules/delete/:module_id', moduleManageController.deleteModule);

export default router;