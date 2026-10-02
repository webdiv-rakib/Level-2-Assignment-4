import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

const createUser = async (payload: RegisterUserPayload) => {
    const { name, email, password, role, experience, bio, skills, availableSlots } = payload;
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
    return user
};

export const userService = {
    createUser
}
