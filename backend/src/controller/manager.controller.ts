import { genSalt, hash } from "bcrypt";
import {
  deliveryPartnerRepo,
  employeeDocRepo,
  storeRepo,
  UserRepo,
  vendorRepo,
} from "../db/repo.db";
import { CreateDeliveryPartnerBody, SetUpBody } from "../helper";
import { Error500 } from "../helper/errorhandler.helper";
import { Manager } from "../model";
import { AuthReq } from "../types/para";
import fs from "fs";
import type { Response } from "express";
export const M_Dashboard = async (req: AuthReq<Manager>, res: Response) => {
  try {
    const total_stores_and_manages = await storeRepo.find({
      select: {
        id: true,
        StoreManager: {
          id: true,
        },
      },
      relations: {
        StoreManager: true,
      },
    });
    const total_vendor = await vendorRepo.find({
      select: {
        id: true,
      },
    });

    return res.json({
      data: {
        stores: total_stores_and_manages,
        store_manager: total_stores_and_manages.map((v) => ({
          ...v.StoreManager,
        })),
        vendor: total_vendor,
      },
    });
  } catch (e) {
    return Error500(res, e);
  }
};
export const M_setUp = async (req: AuthReq<Manager>, res: Response) => {
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

export const M_createDeliveryPartner = async (
  req: AuthReq<Manager>,
  res: Response
) => {
  try {
    const body = CreateDeliveryPartnerBody.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    }

    const existingDeliveryPartner = await UserRepo.findOne({
      where: {
        email: body.data.email,
      },
    });

    if (existingDeliveryPartner) {
      return res.status(409).json({
        status: 409,
        message: "DeliveryPartner already exists",
      });
    }

    const newUser = await UserRepo.save(
      UserRepo.create({
        ...body.data,
      })
    );

    let doc = [];
    for (let i of body.data.doc) {
      if (!fs.existsSync(`static/${newUser.id}`)) {
        fs.mkdirSync(`static/${newUser.id}`, { recursive: true });
      }
      let file_path = `static/${newUser.id}/${randomUUID()}__${i.name}.pdf`;
      fs.writeFileSync(file_path, i.link, "base64");
      doc.push(
        await employeeDocRepo.save(
          employeeDocRepo.create({ ...i, link: file_path })
        )
      );
    }

    const newDeliveryPartner = await deliveryPartnerRepo.save(
      deliveryPartnerRepo.create({
        ...body.data,
        doc,
        user: { id: newUser.id },
      })
    );

    if (newDeliveryPartner == null) {
      return res.status(500).json({
        status: 500,
        message: "internal server error",
      });
    }

    res.cookie(
      "token",
      createToken({ id: newUser.id, role: "DeliveryPartner" }),
      {
        path: "/",
        httpOnly: true,
        encode: btoa,
        expires: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    );

    return res.status(200).json({
      status: 200,
      UserData: newUser,
      roleData: newDeliveryPartner,
    });
  } catch (err) {
    return Error500(res, err);
  }
};

function randomUUID() {
  throw new Error("Function not implemented.");
}

function createToken(arg0: { id: number; role: string }): any {
  throw new Error("Function not implemented.");
}
