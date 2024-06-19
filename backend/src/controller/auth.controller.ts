import type { Request, Response } from "express";
import { CreateUserBody } from "../helper";
import { UserRepo, endUserRepo, superAdminRepo } from "../db/repo.db";
import { createToken } from "../lib";

export const UserRegister = async (req: Request, res: Response) => {
    try {
        const body = CreateUserBody.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json({
                status: 400,
                message: "invalid body",
                error: body.error.errors
            })
        };
        if (body.data.role == "endUser" &&
            body.data.endUserData == undefined) {
            return res.status(400).json({
                status: 400,
                message: "invalid body",
                error: "role data requited!!"
            })
        }
        const user = await UserRepo.findOne({
            where: {
                email: body.data.email
            }
        });
        if (user) {
            return res.status(403).json({
                status: 403,
                message: "email id already exited!!!"
            })
        }
        const newUser = await UserRepo.save(UserRepo.create({
            ...body.data
        }));
        let roleData = null;
        if (body.data.role == "superAdmin") {
            roleData = await superAdminRepo.save(superAdminRepo.create({
                user: {
                    id: newUser.id
                }
            }))
        }
        else if (body.data.role == "endUser") {
            roleData = await endUserRepo.save(endUserRepo.create({
                ...body.data.endUserData,
                user: {
                    id: newUser.id
                }
            }));
        }
        if (roleData == null) {
            return res.status(500).json({
                status: 500,
                message: "internal server error",
            })
        }
        res.cookie("token", createToken({ id: newUser.id, role: body.data.role }), {
            path: "/",
            httpOnly: true,
            encode: btoa
        })
        return res.json({
            data: {
                userData: newUser,
                roleData
            }
        })

    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: "internal server error",
        })
    }
}
export const UserLogin = (req: Request, res: Response) => { }
export const UserLogOut = (req: Request, res: Response) => { }