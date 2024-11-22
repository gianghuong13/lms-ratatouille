import express from 'express';
import courseManageController from '../../controllers/courseManage/courseManage.controller.js';

const router = express.Router();

router.get('/courses', courseManageController.getAllCourses);
router.post('/courses/add', courseManageController.createCourse);
router.get('/teachers', courseManageController.getAllTeachers);
router.get('/students', courseManageController.getAllStudents);
router.get('/terms', courseManageController.getAllTerms);
router.get('/courses/:course_id', courseManageController.getCourseById);
router.put('/courses/:course_id', courseManageController.updateCourse);
router.delete('/courses/:course_id', courseManageController.deleteCourse);

router.get('/users-courses/:user_id', courseManageController.getLoginedUsersCourses);

export default router;