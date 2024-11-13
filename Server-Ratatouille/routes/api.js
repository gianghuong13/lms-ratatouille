import express from "express";
var router = express.Router();
import authRouter from "./auth/auth.js";
import userManageRouter from "./user-manage/user-manage.js";
import courseManageRouter from "./course-manage/course-manage.js";

router.use(authRouter);
router.use(userManageRouter);
router.use(courseManageRouter);

export default router;