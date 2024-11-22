import express from "express";
var router = express.Router();
import authRouter from "./auth/auth.js";
import userManageRouter from "./user-manage/user-manage.js";
import courseManageRouter from "./course-manage/course-manage.js";
import notiManageRouter from "./noti-manage/noti-manage.js";
import fileManageRouter from "./file-manage/file-manage.js";    
import accountManageRouter from "./account-manage/account-manage.js";

router.use(accountManageRouter);
router.use(authRouter);
router.use(userManageRouter);
router.use(courseManageRouter);
router.use(notiManageRouter);
router.use(fileManageRouter);
export default router;