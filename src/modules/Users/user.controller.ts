import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { userService } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResposne } from '../../utils/sendResponse';

const createUser = catchAsync(
    async (req, res, next) => {
        const payload = req.body;
        const user = await userService.createUser(payload);
        sendResposne(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Registered Successfully",
            data: { user }
        })
    }
);

export const userController = {
    createUser
}