import { genSalt, hash } from "bcrypt";
import { orderRepo, storeOrderRepo, UserRepo } from "../db/repo.db";
import { SetUpBody } from "../helper";
import { Error500 } from "../helper/errorhandler.helper";
import { deliveryPartner } from "../model";
import { AuthReq } from "../types/para";
import type { Response } from "express";
export const dp_setUp = async (
  req: AuthReq<deliveryPartner>,
  res: Response
) => {
  try {
    const body = SetUpBody.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    }

    let salt = await genSalt(14);
    req.userData.password = await hash(body.data.password, salt);
    await UserRepo.save(req.userData);

    return res.json({
      status: 200,
      message: "ok",
    });
  } catch (err) {
    return Error500(res, err);
  }
};

export const dp_dashboard = async (
  req: AuthReq<deliveryPartner>,
  res: Response
) => {
  try {
    const total_padding_orders = orderRepo.find({
      where: {
        status: "padding",
        dp: { id: req.roleData.id },
      },
    });
    const total_padding_store_orders = storeOrderRepo.find({
      where: {
        status: "padding",
        dp: { id: req.roleData.id },
      },
    });
    return res.json({
      data: {
        storeOrder: total_padding_store_orders,
        order: total_padding_orders,
      },
    });
  } catch (err) {
    return Error500(res, err);
  }
};
