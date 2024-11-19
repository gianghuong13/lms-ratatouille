import express from 'express';
import notiController from '../../controllers/notiManage/notiManage.controller.js';

const router = express.Router();

router.get('/admin-notifications', notiController.getAllNotifications);
router.get('/admin-course_id-4-noti', notiController.getAllCourses);
router.get('/admin-creator_id-4-noti', notiController.getAllAdmins);
router.post('/admin-create-new-noti', notiController.createNewNoti);
router.get('/admin-posted-noti/:id', notiController.getPostedNotification);
router.get('/admin-selected-courses/:id', notiController.getSelectedCourses);
router.put('/admin-update-noti/:id', notiController.updateNotification);
router.delete('/admin-delete-noti/:id', notiController.deleteNotification);
router.get('/admin-all-title-notification', notiController.getAllTitleNotification);

export default router;