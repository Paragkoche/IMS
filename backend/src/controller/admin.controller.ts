import { Response } from "express";
import { AuthReq } from "../types/para";
import { Admin } from "../model";
import { BodyError, Error500 } from "../helper/errorhandler.helper";

import {
  createItemBody,
  createManagerBody,
  deleteManagerBody,
  SetUpBody,
} from "../helper";
import {
  UserRepo,
  employeeDocRepo,
  itemsImagesRepo,
  itemsRepo,
  managerRepo,
} from "../db/repo.db";
import fs from "fs";
import { genSalt, hash } from "bcrypt";
import { createToken } from "../lib";
import { randomUUID } from "crypto";

export const A_dashboard = async (req: AuthReq<Admin>, res: Response) => {
  try {
    if (req.roleData.firstTimeLogin) {
      return res.status(403).json({
        status: 403,
        message: "first setup your account!!",
      });
    }

    const managers = await managerRepo.find({ select: { id: true } });
    const items = await itemsRepo.find({ select: { id: true } });

    return res.status(200).json({
      status: 200,
      data: {
        manager: managers.length,
        items: items.length,
      },
    });
  } catch (err) {
    return Error500(res, err);
  }
};

export const A_setUp = async (req: AuthReq<Admin>, res: Response) => {
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

export const A_getAllManagers = async (req: AuthReq<Admin>, res: Response) => {
  try {
    const data = await managerRepo.find();
    return res.json({
      status: 200,
      data: data,
    });
  } catch (err) {
    return Error500(res, err);
  }
};

export const A_createManager = async (req: AuthReq<Admin>, res: Response) => {
  try {
    const body = createManagerBody.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    }

    const existingManager = await UserRepo.findOne({
      where: {
        email: body.data.email,
      },
    });

    if (existingManager) {
      return res.status(409).json({
        status: 409,
        message: "Manager already exists",
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

    const newManager = await managerRepo.save(
      managerRepo.create({
        ...body.data,
        doc,
        user: { id: newUser.id },
      })
    );

    if (newManager == null) {
      return res.status(500).json({
        status: 500,
        message: "internal server error",
      });
    }

    res.cookie("token", createToken({ id: newUser.id, role: "manager" }), {
      path: "/",
      httpOnly: true,
      encode: btoa,
      expires: new Date(new Date().setDate(new Date().getDate() + 30)),
    });

    return res.status(200).json({
      status: 200,
      UserData: newUser,
      roleData: newManager,
    });
  } catch (err) {
    return Error500(res, err);
  }
};

export const A_deleteManager = async (req: AuthReq<Admin>, res: Response) => {
  try {
    const body = deleteManagerBody.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    }

    const manager = await managerRepo.findOne({
      where: {
        id: body.data.id,
      },
    });

    if (!manager) {
      return res.status(404).json({
        status: 404,
        message: "Manager not found",
      });
    }

    const deleteManager = await managerRepo.delete(manager.id);
    if (!deleteManager) {
      return res.status(500).json({
        status: 500,
        message: "Failed to delete manager",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Manager deleted successfully",
    });
  } catch (err) {
    return Error500(res, err);
  }
};

export const A_getAllItems = async (req: AuthReq<Admin>, res: Response) => {
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
  } catch (err) {
    return Error500(res, err);
  }
};

export const A_CreateItem = async (req: AuthReq<Admin>, res: Response) => {
  try {
    const body = createItemBody.safeParse(req.body);
    if (!body.success) {
      return BodyError(res, body.error.errors);
    }
    const newItem = await itemsImagesRepo.save(
      itemsRepo.create({
        name: body.data.name,
        des: body.data.des,
        price: body.data.price,
      })
    );
    let images = [];
    let k = 1;
    for (let i of body.data.images) {
      if (!fs.existsSync(`static/items/${newItem.id}`)) {
        fs.mkdirSync(`static/items/${newItem.id}`, { recursive: true });
      }
      let file_path = `static/items/${newItem.id}/${randomUUID()}__${
        newItem.name
      }_${k}.png`;
      fs.writeFileSync(file_path, i.url, "base64");
      images.push(
        await itemsImagesRepo.save(
          itemsImagesRepo.create({ ...i, url: file_path })
        )
      );
      k++;
    }
    await itemsRepo.save({
      ...newItem,
      images,
    });
    return res.json({
      status: 200,
      data: await itemsRepo.findOne({
        where: { id: newItem.id },
        relations: { images: true },
      }),
    });
  } catch (e) {
    return Error500(res, e);
  }
};
export const A_UpdateItem = async (req: AuthReq<Admin>, res: Response) =>{
  try{
      const body = createItemBody.safeParse(req.body);

      if(!body.success){
          return BodyError(res, body.error.errors);
      }

      const ExistingItem = await itemsRepo.findOne({
          where: {
              name: body.data.name
          }
      });

      if(!ExistingItem){
          return res.status(404).json({
              status: 404,
              message: "Item not found"
          });
      };

      const updatedItem = await itemsRepo.save(
          itemsRepo.create({
              id: ExistingItem.id,
              ...body.data
          })
      );

      if(!updatedItem){
          return res.status(500).json({
              status: 500,
              message: "Failed to update item"
          });
      };

      return res.status(200).json({
          status: 200,
          data: updatedItem
      })
  }
  catch(e){
      return Error500(res,e);
  }
};

export const A_deleteItem = async (req: AuthReq<Admin>, res: Response) =>{
  try{
      const body = createItemBody.safeParse(req.body);

      if(!body.success){
          return BodyError(res, body.error.errors);
      }

      const item = await itemsRepo.findOne({
          where: {
              name: body.data.name
          }
      });

      if(!item){
          return res.status(404).json({
              status: 404,
              message: "Item not found"
          });
      };

      const deletedItem = await itemsRepo.delete(item?.name)

      if(!deletedItem){
          return res.status(500).json({
              status: 500,
              message: "Failed to delete item"
          });
      };

      return res.status(200).json({
          status: 200,
          message: "Item deleted successfully"
      });
  }
  catch(e){
      return Error500(res,e);
  }
}