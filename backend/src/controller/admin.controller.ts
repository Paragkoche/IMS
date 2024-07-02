import { Response } from "express";
import { AuthReq } from "../types/para";
import { Admin } from "../model";
import { Error500 } from "../helper/errorhandler.helper";
import { UserRepo, itemsRepo, managerRepo} from "../db/repo.db";
import { AdminSetUpBody, createManagerBody } from "../helper";
import { genSalt, hash } from "bcrypt";
import { createToken } from "../lib";

export const A_dashboard = async (req: AuthReq<Admin>, res: Response) =>{
    try {
        if(req.roleData.firstTimeLogin){
            return res.status(403).json({
                status: 403,
                message: "first setup your account!!"
            });
        }

        const managers = await managerRepo.find({ select: {id: true}})
        const items = await itemsRepo.find({ select: {id: true}});


        return res.status(200).json({
            status: 200,
            data: {
                manager: managers.length,
                items: items.length
            }
        });
    }
    catch(err){
        return Error500(res,err);
    };
};

export const A_setUp = async (req: AuthReq<Admin>, res: Response) =>{
    try{
        const body = AdminSetUpBody.safeParse(req.body);

        if(!body.success){
            return res.status(400).json({
                status: 400,
                message: "invalid body",
                error: body.error.errors,
            });
        };

        let salt = await genSalt(14);
        req.userData.password = await hash(body.data.password, salt);
        await UserRepo.save(req.userData);

        return res.json({
            status: 200,
            message: "ok",
        });
    }
    catch(err){
        return Error500(res,err);
    }
};

export const A_getAllManagers = async (req: AuthReq<Admin>, res: Response)=>{
    try{
        const data = await managerRepo.find();
        return res.json({
            status: 200,
            data: data
        });
    }
    catch(err){
        return Error500(res,err);
    }
};

export const A_createManager = async (req: AuthReq<Admin>, res: Response)=>{
    try{
        const body = await createManagerBody.safeParse(req.body);

        if(!body.success){
            return res.status(400).json({
                status: 400,
                message: "invalid body",
                error: body.error.errors,
            });
        };

        const existingManager = await UserRepo.findOne({
            where:{
                username: req.body.name,
            }
        });

        if(existingManager){
            return res.status(409).json({
                status: 409,
                message: "Manager already exists"
            });
        };

        const newManager = await managerRepo.save(
            managerRepo.create({
                ...body.data
            })
        );

        if(newManager == null){
            return res.status(500).json({
                status: 500,
                message: "internal server error"
            });
        };

        res.cookie("token", createToken({ id: newManager.id, role: "manager"}), {
            path: "/",
            httpOnly: true,
            encode: btoa,
            expires: new Date(new Date().setDate(new Date().getDate() + 30)),
          });

          return res.status(200).json({
            status: 200,
            Userdata: newManager,
          })
    }
    catch(err){
        return Error500(res,err);
    }
};

export const A_deleteManager = async (req: AuthReq<Admin>, res: Response) =>{
    try{
        const body = createManagerBody.safeParse(req.body);
         
        if(!body.success){
            return res.status(400).json({
                status: 400,
                message: "invalid body",
                error: body.error.errors,
            });
        };

        const manager = await managerRepo.findOne({
            where:{
                name: body.data.name
            }
        });

        if(!manager){
            return res.status(404).json({
                status: 404,
                message: "Manager not found"
            });
        };

        const deleteManager = await managerRepo.delete(manager.id);
        if(!deleteManager){
            return res.status(500).json({
                status: 500,
                message: "Failed to delete manager"
            });
        };

        return res.status(200).json({
            status: 200,
            message: "Manager deleted successfully"
        });
    }
    catch(err){
        return Error500(res,err);
    }
};

export const A_getAllItems = async (req: AuthReq<Admin>, res: Response) =>{
    try{
        const data = await itemsRepo.find();
        return res.json({
            status: 200,
            data: data
        });
    }
    catch(err){
        return Error500(res,err);
    }
}