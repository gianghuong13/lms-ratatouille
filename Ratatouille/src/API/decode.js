import { StatusCodes } from "http-status-codes";
import { decodeAccessToken } from "../utils/jwt.js";
import express from 'express';
import { errorResponse, successResponse } from "../utils/response.js";

const router = express.Router();

router.post('/decode', (req, res) => {
    const { accessToken } = req.body;
    
    try {
        const decodedAccessToken = decodeAccessToken(accessToken);
    
        return successResponse(res, StatusCodes.OK, "Decode successfully", decodedAccessToken);
    } catch (error) {
        console.log("Error from decode: ", error);
        return errorResponse(res, StatusCodes.UNAUTHORIZED, "Unauthorized! Vui lòng đăng nhập lại");
    }

});

export default router;