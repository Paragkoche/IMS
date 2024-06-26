import type { Response } from "express";
import { AuthReq } from "../types/para";
import { SuperAdmin } from "../model";
import { Error500 } from "../helper/errorhandler.helper";
import { adminRepo, endUserRepo, orderRepo, storeRepo } from "../db/repo.db";
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
