import express from 'express';
import moduleManageController from '../../controllers/moduleManage/moduleManage.controller.js';

const router = express.Router();

router.get('/modules', moduleManageController.getModules);
router.post('/modules/add', moduleManageController.addModule);

export default router;