import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";


const app: Application = express();

//must have middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.app_url,
    credentials: true
}));


app.get('/', (req: Request, res: Response) => {
    res.send("Hellow World!")
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { name, email, password, role, experience, bio, skills, availableSlots } = req.body;
    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (isUserExist) {
        throw new Error("User Already Exists")
    };
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role
        },
    });
    if (role === "TECHNICIAN") {
        await prisma.technicianProfile.create({
            data: {
                userId: createdUser.id,
                experience: experience || 0,
                bio: bio || null,
                skills: skills || [],
                availableSlots: availableSlots || []
            },
        });
    };
    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email
        },
        omit: {
            password: true
        },
        include: {
            technicianProfile: true
        }
    });
    res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        message: "User Registered Successfully",
        data: { user }
    });
});

export default app;