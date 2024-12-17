import express from 'express';
import submissionManageController from '../../controllers/submissionMange/submissionMange.controller.js';
const router = express.Router();

router.post('/submission/create/:assignment_id/:student_id', submissionManageController.createSubmission);
router.post('/submission/create-files/:submission_id', submissionManageController.createSubmissionFile);

export default router;