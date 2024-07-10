import { genSalt, hash } from "bcrypt";
import { orderRepo, storeOrderRepo, UserRepo } from "../db/repo.db";
import { DeliveredBody, SetUpBody } from "../helper";
import { BodyError, Error500 } from "../helper/errorhandler.helper";
import { deliveryPartner } from "../model";
import { AuthReq } from "../types/para";
import type { Response } from "express";
import e from "express";

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
    const total_pending_orders = orderRepo.find({
      where: {
        status: "pending",
        dp: { id: req.roleData.id },
      },
    });
    const total_pending_store_orders = storeOrderRepo.find({
      where: {
        status: "pending",
        dp: { id: req.roleData.id },
      },
    });
    return res.json({
      data: {
        storeOrder: total_pending_store_orders,
        order: total_pending_orders,
      },
    });
  } catch (err) {
    return Error500(res, err);
  }
};

export const dp_deliveredOrder = async (req: AuthReq<deliveryPartner>, res: Response) => {
  try{
    const body = DeliveredBody.safeParse(req.body);

    if(!body.success){
      return BodyError(res, body.error.errors);
    };

    const order = await orderRepo.findOne({
      where: {
        id: body.data.orderId,
      }
    })

    if(!order){
      return res.status(404).json({
        status: 404,
        message: "Order not found",
      });
    };

    await orderRepo.save({ ...order, status: body.data.status })
    return res.json({
      status: 200,
      data: order
    })
  }
  catch(e){
    return Error500(res, e);
  }
};

export const dp_getAllOrders = async(req: AuthReq<deliveryPartner>, res: Response) => {
  try{
    const total_orders = await orderRepo.find({
      where: {
        dp: { id: req.roleData.id },
      }
    });

    return res.json({
      data: total_orders
    })
  }
  catch(e){
    return Error500(res, e)
  }
}
