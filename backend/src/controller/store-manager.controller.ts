import { Response } from "express";
import { AuthReq } from "../types/para";
import { Error500 } from "../helper/errorhandler.helper";
import { StoreManager } from "../model";
import { itemsRepo, orderRepo, storeOrderRepo, UserRepo } from "../db/repo.db";
import { genSalt, hash } from "bcrypt";
import { SetUpBody, StoreManageReqOrderBody } from "../helper";

export const SM_Dashboard = (req: AuthReq<StoreManager>, res: Response) => {
  try {
    const total_items = itemsRepo.find({
      where: {
        store: {
          StoreManager: {
            id: req.roleData.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        Qty: true,
        images: true,
      },
    });
    const total_orders = orderRepo.find({
      where: {
        items: {
          store: {
            StoreManager: {
              id: req.roleData.id,
            },
          },
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    const total_self_orders = storeOrderRepo.find({
      where: {
        store: {
          StoreManager: {
            id: req.roleData.id,
          },
        },
      },
      select: {
        id: true,
        status: true,
      },
    });
    return res.json({
      status: 200,
      data: {
        items: total_items,
        orders: total_orders,
        selfOrder: total_self_orders,
      },
    });
  } catch (e) {
    return Error500(res, e);
  }
};

export const SM_setUp = async (req: AuthReq<StoreManager>, res: Response) => {
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

export const SM_reqOrder = async (
  req: AuthReq<StoreManager>,
  res: Response
) => {
  try {
    const body = StoreManageReqOrderBody.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    }
    if (body.data.status != "REQ" && body.data.orderId == null) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: "invalid Order Id or order id is not null",
      });
    }
    if (body.data.status != "REQ") {
      const getOrder = storeOrderRepo.findOne({
        where: {
          id: body.data.orderId,
        },
      });
      await storeOrderRepo.save({
        ...getOrder,
        status: body.data.status,
      });
      return res.json({
        status: 200,
        message: "order is update",
      });
    }
    let itm = [];
    for (let i of body.data.itemsId) {
      let item = await itemsRepo.findOne({
        where: { id: i },
      });
      if (!item) {
        return res.status(404).json({
          error: `${i} this item id not found`,
        });
      }
      itm.push(item);
    }
    const newOrder = await storeOrderRepo.save(
      storeOrderRepo.create({
        status: body.data.status,
        items: itm,
        atNow: "ON-PROCESS",
      })
    );
    return res.json({
      status: 200,
      data: newOrder,
    });
  } catch (err) {
    return Error500(res, err);
  }
};

export const SM_getAllItems = async (
  req: AuthReq<StoreManager>,
  res: Response
) => {
  try {
    const { limit = 20, end = 1 } = req.query; // http://localhost:port/path?name=NAME&

    const skip = Number(limit) * Number(end) - Number(limit);
    const data = await itemsRepo.find({
      where: {
        store: {
          StoreManager: {
            id: req.roleData.id,
          },
        },
      },

      take: Number(limit),
      skip,
    });
    return res.json({
      states: 200,
      data,
    });
  } catch (err) {
    return Error500(res, err);
  }
};
