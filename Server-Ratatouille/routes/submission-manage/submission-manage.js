import express from 'express';
import submissionManageController from '../../controllers/submissionMange/submissionMange.controller.js';
const router = express.Router();

router.post('/submission/create/:assignment_id/:student_id', submissionManageController.createSubmission);
router.post('/submission/create-files/:submission_id', submissionManageController.createSubmissionFile);
router.get('/submission/get/:assignment_id/:student_id', submissionManageController.getSubmission);
router.get('/submission/get-filename-path/:submission_id', submissionManageController.getSubmissionFileNameAndPath);
router.delete('/submission/delete/:submission_id', submissionManageController.deleteSubmission);
router.delete('/submission/delete-files/:submission_id', submissionManageController.deleteSubmissionFile);
export default router;