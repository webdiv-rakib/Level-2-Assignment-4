import httpStatus from 'http-status';
import { Request, Response } from "express";
import { userService } from './user.service';

const createUser = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const result = await userService.createUser(payload)
        res.status(httpStatus.CREATED).json({
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Registered Successfully",
            data: result
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Filed To Register User",
            error: (error as Error).message
        });
    }
};

export const userController = {
    createUser
}