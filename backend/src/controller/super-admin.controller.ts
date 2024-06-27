import type { Response } from "express";
import { AuthReq } from "../types/para";
import { Admin, SuperAdmin } from "../model";
import { Error500 } from "../helper/errorhandler.helper";
import { UserRepo, adminRepo, endUserRepo, orderRepo, storeRepo } from "../db/repo.db";
import { createAdminBody } from "../helper";
import { createToken } from "../lib";
export const SP_dashboard = async (req: AuthReq<SuperAdmin>, res: Response) => {
  try {
    const totalAdmins = await adminRepo.find({ select: { id: true } });
    const totalStore = await adminRepo.find({ select: { id: true } });
    const totalPayments = await adminRepo.find({ select: { id: true } });
    const totalUsers = await endUserRepo.find({ select: { id: true } });
    const EndUserOrder = await orderRepo.find({ select: { id: true } });
    return res.json({
      data: {
        admin: totalAdmins.length,
        store: totalStore.length,
        payments: totalPayments.length,
        users: totalUsers.length,
        orders: EndUserOrder.length,
      },
    });
  } catch (e) {
    return Error500(res, e);
  }
};

export const SP_GetAllAdmins = async (
  req: AuthReq<SuperAdmin>,
  res: Response
) => {
  try {
    return res.json({
      data: await adminRepo.find(),
    });
  } catch (e) {
    return Error500(res, e);
  }
};

export const SP_GetAllStores = async (
  req: AuthReq<SuperAdmin>,
  res: Response
) => {
  try {
    return res.json({
      data: await storeRepo.find(),
    });
  } catch (e) {
    return Error500(res, e);
  }
};

export const SP_CreateAdmin = async (req: AuthReq<Admin>, res: Response)=>{
  try{
      const body = createAdminBody.safeParse(req.body);
      if(!body.success){
        return res.status(400).json({
          status: 400,
          message: "invalid body",
          errors: body.error.errors
        });
      }

      const existingAdmin = await UserRepo.findOne({
        where: {
          email: body.data.email,
        },
      });

      if(existingAdmin){
        return res.status(409).json({
          status: 409,
          message: "email already exists",
        });
      }

      const newAdmin = await UserRepo.save(
        UserRepo.create({
          ...body.data
        })
      );

      let roleData = await adminRepo.save(
        adminRepo.create({
          role: body.data.role,
          user: {
            id: newAdmin.id,
          }
        })
      );

      if(roleData == null){
        return res.status(500).json({
          status: 500,
          message: "internal server error",
        })
      };

      res.cookie("token", createToken({ id: newAdmin.id, role: "admin"}), {
        path: "/",
        httpOnly: true,
        encode: btoa,
        expires: new Date(new Date().setDate(new Date().getDate() + 30)),
      })

      return res.json({
        data: {
          userData: newAdmin.toJson(),
          roleData,
        },
      });
  }
  catch(e){
    return Error500(res,e);
  }
}

export const SP_updateAdmin = async (req: AuthReq<Admin>, res: Response)=> {
  try{
    const body = createAdminBody.safeParse(req.body);
    
    if(!body.success){
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        errors: body.error.errors
      });
    }

    const ExistingAdmin = await UserRepo.findOne({
      where: {
        email: body.data?.email
      }
    });

    if(!ExistingAdmin){
      return res.status(404).json({
        status: 404,
        message: "Admin not found",
      });
    };

    const updatedAdmin = await adminRepo.save(
      adminRepo.create({
        user: {
          id: ExistingAdmin.id,
        },
       ...body.data
      })
    );

    if(!updatedAdmin){
      return res.status(500).json({
        status: 500,
        message: "Failed to update admin role data",
      });
    };

    return res.json({
      data: {
        userData: updatedAdmin,
        updatedAdmin
      }
    })
  }
  catch(e){
    return Error500(res,e);
  }
};

export const SP_deleteAdmin = async (req: AuthReq<Admin>, res: Response) => {
  try{
    const body = createAdminBody.safeParse(req.body);
    if(!body.success){
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        errors: body.error.errors
      });
    };

    const admin = await UserRepo.findOne({
      where: {
        email: body.data?.email
      }
    });
    if(!admin){
      return res.status(404).json({
        status: 404,
        message: "Admin not found",
      });
    };

    const deletedAdmin = await UserRepo.delete(admin.id);
    if(!deletedAdmin){
      return res.status(500).json({
        status: 500,
        message: "Failed to delete admin",
      });
    };

    return res.json({
      status: 200,
      message: "Admin deleted successfully",
    })
  }
  catch(e){
    return Error500(res,e);
  }
}