import { env } from "../helper";
import jwt from "jsonwebtoken";
import { userRole } from "../types/para";

export const createToken = (data: {
    id: number,
    role: userRole
}) => jwt.sign(data, env.JWT_KEY || "", {
    expiresIn: "30day"
})

export const verifyToken = (token: string) => jwt.verify(token, env.JWT_KEY ?? "")