import { z } from "zod";

export const CreateUserBody = z.object({
    email: z.string().email(),
    password: z.string(),
    username: z.string(),
    role: z.enum(["superAdmin", "endUser"]),
    endUserData: z.object({
        age: z.number(),
        address: z.string(),
        name: z.string(),
        phoneNumber: z.string(),
    }).optional()

});

export const LoginUserBody = z.object({
    email: z.string().email(),
    password: z.string(),
    role: z.enum([
        "superAdmin",
        "admin",
        "developer",
        "manager",
        "endUser",
        "storeManager",
        "vendor"
    ])
})