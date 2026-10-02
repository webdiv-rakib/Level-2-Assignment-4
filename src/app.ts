import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/enums";

const app: Application = express();

//must have middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.app_url,
    credentials: true
}))


app.get('/', (req: Request, res: Response) => {
    res.send("Hellow World!")
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (isUserExist) {
        throw new Error("User already exists")
    };
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role
        }
    });
    if (role === "TECHNICIAN") {
        await prisma.technicianProfile.create({
            data: {
                userId: createdUser.id,
                experience: 0,
                skills: [],
                availableSlots: []
            }
        })
    };
    res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        data: {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role
        }
    });
});

export default app;