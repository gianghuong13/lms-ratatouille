import bcrypt from 'bcrypt';
import connection from '../../database/dbConnect.js';
import { errorResponse, successResponse } from '../../utils/response.js';
import { StatusCodes } from 'http-status-codes';
import { createAccessToken,createRefreshToken, decodeAccessToken } from '../../utils/jwt.js';
import ms from 'ms';
const authController = {
    login: (req, res) => {
        const { email, password } = req.body;
        
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], async (err, results) => {
            if (err) {
                return res.status(500).send('Error executing query');
            }
            if (results.length > 0) {
                const user = results[0];
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (isPasswordValid) {
                    const accessToken = createAccessToken({ userId: user.user_id, role: user.role });
                    const refreshToken = createRefreshToken({ userId: user.user_id });
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        maxAge: ms("7 days"),
                    });
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        maxAge: ms("7 days"),
                    });
                    return successResponse(res, StatusCodes.OK, 'Login successfully', { 
                        user: { fullName: user.full_name, email: user.email }, 
                        accessToken, 
                        refreshToken 
                    });
                } else {
                    res.status(401).json({ message: 'Invalid email or password' });
                }
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        });
    },

    decode: (req, res) => {
        const { accessToken } = req.body;
        
        try {
            const decodedAccessToken = decodeAccessToken(accessToken);
        
            return successResponse(res, StatusCodes.OK, "Decode successfully", decodedAccessToken);
        } catch (error) {
            console.log("Error from decode: ", error);
            return errorResponse(res, StatusCodes.UNAUTHORIZED, "Unauthorized! Vui lòng đăng nhập lại");
        }
    }
};

export default authController;
