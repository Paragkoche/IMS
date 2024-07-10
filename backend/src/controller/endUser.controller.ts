import { billsRepo, endUserRepo, orderRepo } from "../db/repo.db";
import { EndUserBody, itemOrderBody } from "../helper";
import { BodyError, Error500 } from "../helper/errorhandler.helper";
import { EndUser } from "../model";
import { AuthReq } from "../types/para";
import type { Response } from "express"; 

export const EU_profile = async (req: AuthReq<EndUser>, res: Response) => {
    try{
        return res.json({
            data: {
                user: req.role,
                roledata: req.roleData
            }
        })
    }
    catch (err) {
        return Error500(res, err);
      }
};

export const EU_getAllOrders = async (req: AuthReq<EndUser>, res: Response) => {
    try{
        return res.json({
            data: await orderRepo.find()
        })
    }
    catch(e){
        return Error500(res, e);
    }
};

export const EU_OrderBill = async (req: AuthReq<EndUser>, res: Response) => {
    try{
        const OrderID = parseInt(req.params.orderId);

        const bill = await billsRepo.findOne({
            where: {
                order: {
                    id: OrderID
                }
            }
        });

        if(!bill){
            return res.status(404).json({
                status: 404,
                message: "order for the bill is not found!"
            });
        };

        return res.status(200).json({
            status: 200,
            data: bill
        })
    }
    catch(e){
        return Error500(res, e);
    }
};

export const EU_AddOrder = async (req: AuthReq<EndUser>, res: Response) => {
    try{
        const body = itemOrderBody.safeParse(req.body);

        if(!body.success){
            return BodyError(res, body.error.errors);
        };

        const ExistingOrder = await orderRepo.findOne({
            where: {
                items: {
                    name: body.data.name
                }
            }
        });

        if(!ExistingOrder){
            return res.status(409).json({
                status: 409,
                message: "order already exists!"
            })
        };

        const newOrder = await orderRepo.save(
            orderRepo.create({
                status: body.data.order.status,
                payment_status: body.data.order.payment_status,
                atNow: new Date()
            })
        );

        if(!newOrder){
            return res.status(500).json({
                status: 500,
                message: "Failed to create order!"
            });
        };

        return res.status(200).json({
            status: 200,
            data: newOrder
        });
    }
    catch(e){
        return Error500(res, e)
    }
};

export const EU_updateOrder = async (req: AuthReq<EndUser>, res: Response) => {
    try{
        const body =itemOrderBody.safeParse(req.body)

        if(!body.success){
            return BodyError(res, body.error.errors);
        };

        const ExistingOrder = await orderRepo.findOne({
            where: {
                items: {
                    name: body.data.name
                }
            }
        });

        if(!ExistingOrder){
            return res.status(404).json({
                status: 404,
                message: "order not found!"
            });
        }

        const updatedOrder = await orderRepo.save(
            orderRepo.create({
                id: ExistingOrder.id,
                status: body.data.order.status,
                payment_status: body.data.order.payment_status,
                atNow: ExistingOrder.atNow
            })
        );

        if(!updatedOrder){
            return res.status(500).json({
                status: 500,
                message: "Failed to update order!"
            });
        };

        return res.status(200).json({
            status: 200,
            data: updatedOrder
        });
    }
    catch(e){
        return Error500(res, e);
    }
};

export const EU_updateProfile = async (req: AuthReq<EndUser>, res: Response) => {
    try{
        const body = EndUserBody.safeParse(req.body);

        if(!body.success){
            return BodyError(res, body.error.errors);
        };

        const ExistingUser = await endUserRepo.findOne({
            where: {
                name: body.data.name
            }
        });

        if(!ExistingUser){
            return res.status(404).json({
                status: 404,
                message: "user not found!"
            });
        };

        const updatedUser = await endUserRepo.save(
            endUserRepo.create({
                id: ExistingUser.id,
                ...body.data
            })
        );

        if(!updatedUser){
            return res.status(500).json({
                status: 500,
                message: "Failed to update user profile!"
            });
        }

        return res.status(200).json({
            status: 200,
            data: updatedUser
        });
    }
    catch(e){
        return Error500(res, e);
    }
}