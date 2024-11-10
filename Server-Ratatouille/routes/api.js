import express from "express";
var router = express.Router();
import authRouter from "./auth/auth.js";
import userManageRouter from "./user-manage/user-manage.js";

router.use(authRouter);
router.use(userManageRouter);


export default router;