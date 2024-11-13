import express from 'express';
import notiController from '../../controllers/notiManage/notiManage.controller.js';

const router = express.Router();

router.get('/admin-notifications', notiController.getAllNotifications);

export default router;