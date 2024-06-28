import { genSalt, hash } from "bcrypt";
import { UserRepo, itemsRepo, managerRepo } from "../db/repo.db";
import { AdminSetUpBody } from "../helper";
import { BodyError, Error500 } from "../helper/errorhandler.helper";
import { Admin } from "../model";
import { AuthReq } from "../types/para";
import type { Response } from "express";

export const A_dashboard = async (req: AuthReq<Admin>, res: Response) => {
  try {
    if (req.roleData.firstTimeLogin) {
      return res.status(401).json({
        status: 401,
        message: "first setup your account!!",
      });
    }
    const mangers = await managerRepo.find({ select: { id: true } });
    const items = await itemsRepo.find({ select: { id: true } });

    return res.json({
      status: 200,
      data: {
        manages: mangers.length,
        items: items.length,
      },
    });
  } catch (e) {
    return Error500(res, e);
  }
};

export const A_setUp = async (req: AuthReq<Admin>, res: Response) => {
  try {
    const body = AdminSetUpBody.safeParse(req.body);
    if (!body.success) {
      return BodyError(res, body.error.errors);
    }
    let salt = await genSalt(14);
    req.userData.password = await hash(body.data.password, salt);
    await UserRepo.save(req.userData);
    return res.json({
      status: 200,
      message: "OK",
    });
  } catch (e) {
    return Error500(res, e);
  }
};

export const A_GetAllManager = async (req: AuthReq<Admin>, res: Response) => {
  try {
    const data = await managerRepo.find();
    return res.json({
      states: 200,
      data,
    });
  } catch (e) {
    return Error500(res, e);
  }
};

export const A_GetItems = async (req: AuthReq<Admin>, res: Response) => {
  try {
    const { limit = 20, end = 1 } = req.query; // http://localhost:port/path?name=NAME&

    const skip = Number(limit) * Number(end) - Number(limit);
    const data = await itemsRepo.find({
      take: Number(limit),
      skip,
    });
    return res.json({
      states: 200,
      data,
    });
  } catch (e) {
    return Error500(res, e);
  }
};
