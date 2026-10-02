import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { userService } from './user.service';
import { catchAsync } from '../../utils/catchAsync';

const createUser = catchAsync(
    async (req, res, next) => {
        const payload = req.body;
        const result = await userService.createUser(payload);
        res.status(httpStatus.CREATED).json({
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Registered Successfully",
            data: result
        });
    }
)

export const userController = {
    createUser
}