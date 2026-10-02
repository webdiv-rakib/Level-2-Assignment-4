import { Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
    name: string,
    email: string,
    password: string,
    role?: Role,
    experience?: number,
    bio?: string,
    skills?: string[],
    availableSlots?: string[]
}