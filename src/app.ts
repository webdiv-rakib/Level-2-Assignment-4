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
}))


app.get('/', (req: Request, res: Response) => {
    res.send("Hellow World!")
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
    const payload = req.body;
    const { name, email, password, role, experience, skills, availableSlots, bio } = payload;
    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        },


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
        omit: {
            password: true
        },
    });
    if (role === "TECHNICIAN") {
        await prisma.technicianProfile.create({
            data: {
                userId: createdUser.id,
                experience: experience,
                skills: skills,
                availableSlots: availableSlots,
                bio: bio
            }
        })
    }
    res.status(httpStatus.OK).json({
        message: "User Registered Successfully",
        data: createdUser
    })

    // const { name, email, password, role, experience, skills, availableSlots, bio } = req.body;
    // const isUserExist = await prisma.user.findUnique({
    //     where: {
    //         email
    //     }
    // });
    // if (isUserExist) {
    //     throw new Error("User already exists")
    // };
    // const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
    // const createdUser = await prisma.user.create({
    //     data: {
    //         name,
    //         email,
    //         password: hashedPassword,
    //         role,
    //     },
    // });
    // if (role === "TECHNICIAN") {
    //     await prisma.technicianProfile.create({
    //         data: {
    //             userId: createdUser.id,
    //             experience: experience,
    //             bio: bio,
    //             skills: skills,
    //             availableSlots: availableSlots
    //         }
    //     })
    // };
    // res.status(201).json({
    //     success: true,
    //     message: "User Registered Successfully",
    //     data: {
    //         user: {
    //             id: createdUser.id,
    //             name: createdUser.name,
    //             email: createdUser.email,
    //             password: createdUser.password,
    //             role: createdUser.role,
    //         }
    //     }
    // });
});

export default app;