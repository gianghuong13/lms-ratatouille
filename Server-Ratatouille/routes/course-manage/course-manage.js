import express from 'express';
import courseManageController from '../../controllers/courseManage/courseManage.controller.js';

const router = express.Router();

router.get('/courses', courseManageController.getAllCourses);
router.post('/courses/add', courseManageController.createCourse);
router.get('/teachers', courseManageController.getAllTeachers);
router.get('/students', courseManageController.getAllStudents);
router.get('/terms', courseManageController.getAllTerms);
router.get('/courses/:course_id/teachers', courseManageController.getCourseTeachers);
router.get('/courses/:course_id/students', courseManageController.getCourseStudents);
// router.get('/:id', courseController.getCourseById);
// router.put('/:id', courseController.updateCourse);
// router.delete('/:id', courseController.deleteCourse);

export default router;