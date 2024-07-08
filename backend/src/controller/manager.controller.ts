import { genSalt, hash } from "bcrypt";
import {
  deliveryPartnerRepo,
  employeeDocRepo,
  storeManagerRepo,
  storeOrderRepo,
  storeRepo,
  UserRepo,
  vendorRepo,
} from "../db/repo.db";
import { CreateDeliveryPartnerBody, CreateStoreBody, CreateStoreManagerBody, CreateVendorBody, SetUpBody, StoreManageReqOrderBody } from "../helper";
import { BodyError, Error500 } from "../helper/errorhandler.helper";
import { Manager } from "../model";
import { AuthReq } from "../types/para";
import fs from "fs";
import type { Response } from "express";
import { randomUUID } from "crypto"
import { createToken } from "../lib";


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

export const M_getAllDeliveryPartners = async (reg: AuthReq<Manager>, res: Response) => {
  try {
    return res.json({
      data: await deliveryPartnerRepo.find()
    })
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_deleteDeliveryPartners = async (req: AuthReq<Manager>, res: Response) => {
  try {
    const body = CreateDeliveryPartnerBody.safeParse(req.body);
    
    if(!body.success){
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    }

    const dp = await deliveryPartnerRepo.findOne({
      where: {
        address: body.data.address
      }
    });

    if(!dp){
      return res.status(404).json({
        status: 404,
        message: "delivery partner not found"
      })
    };

    const deleteDeliveryPartner = await deliveryPartnerRepo.delete(dp.id);

    if(!deleteDeliveryPartner){
      return res.status(500).json({
        status: 500,
        message: "Failed to delete delivery partner"
      })
    };

    return res.status(200).json({
      status: 200,
      message: "Successfully deleted delivery partner"
    })
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_getAllStoreManagers = async (req: AuthReq<Manager>, res: Response) => {
  try {
    return res.json({
      data: await storeManagerRepo.find()
    })
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_createStoreManager = async (
  req: AuthReq<Manager>,
  res: Response
) => {
  try {
    const body = CreateStoreManagerBody.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    }

    const existingStoreManager = await UserRepo.findOne({
      where: {
        email: body.data.email,
      },
    });

    if (existingStoreManager){
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
    for(let i of body.data.doc){
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
    };
    

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

export const M_deleteStoreManager = async (req:AuthReq<Manager>, res: Response) => {
  try{
    const body = CreateStoreManagerBody.safeParse(req.body);

    if(!body.success){
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    };

    const storemanager = await storeManagerRepo.findOne({
      where: {
        joinAt: body.data.joinAt
      }
    });

    if(!storemanager){
      return res.status(404).json({
        status: 404,
        message: "store manager not found"
      })
    }

    const deleteStoreManager = await storeManagerRepo.delete(storemanager?.id);

    if(!deleteStoreManager){
      return res.status(500).json({
        status: 500,
        message: "Failed to delete store manager"
      });
    };

    return res.status(200).json({
      status: 200,
      message: "Successfully deleted store manager"
    })
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_updateAssignedOrder = async (req: AuthReq<Manager>, res: Response) => {
  try{
    const body = StoreManageReqOrderBody.safeParse(req.body);

    if(!body.success){
      return BodyError(res, body.error.errors);
    };

    const ExistingOrder = await storeOrderRepo.findOne({
      where: {
        status: body.data.status
      }
    });

    if(!ExistingOrder){
      return res.status(404).json({
        status: 404,
        message: "order not found"
      })
    };

    const updatedOrder = await storeOrderRepo.save(
      storeOrderRepo.create({
        id: ExistingOrder.id,
        ...body.data
      })
    );

    if(!updatedOrder){
      return res.status(500).json({
        status: 500,
        message: "Failed to update order"
      });
    };

    return res.status(200).json({
      status: 200,
      message: "Successfully updated order"
    });
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_getAllStores = async (req: AuthReq<Manager>, res: Response) => {
  try{
    return res.json({
      data: await storeRepo.find()
    })
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_createStore = async (req: AuthReq<Manager>, res: Response) => {
  try{
    const body = CreateStoreBody.safeParse(req.body);

    if(!body.success){
      return BodyError(res, body.error.errors);
    };

    const existingStore = await storeRepo.findOne({
      where: {
        name: body.data.name
      }
    });

    if(existingStore){
      return res.status(409).json({
        status: 409,
        message: "store already exists"
      })
    };

    const newStore = await storeRepo.save(
      storeRepo.create({
       ...body.data,
        isOpen: true,
        since: new Date(),
        StoreManager: { id: req.userData.id },
        itemsAvailableInStore: [],
        orders: [],
      })
    );

    if(!newStore){
      return res.status(500).json({
        status: 500,
        message: "Failed to create store"
      });
    };

    return res.status(200).json({
      status: 200,
      data: newStore
    })
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_deleteStore = async (req: AuthReq<Manager>, res: Response) => {
  try{
    const body = CreateStoreBody.safeParse(req.body);

    if(!body.success){
      return BodyError(res, body.error.errors);
    };

    const existingStore = await storeRepo.findOne({
      where: {
        name: body.data.name
      }
    });

    if(!existingStore){
      return res.status(404).json({
        status: 404,
        message: "store not found"
      })
    };

    const deleteStore = await storeRepo.delete(existingStore?.id);

    if(!deleteStore){
      return res.status(500).json({
        status: 500,
        message: "Failed to delete store"
      });
    };

    return res.status(200).json({
      status: 200,
      message: "Successfully deleted store"
    })
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_getAllVendors = async (req: AuthReq<Manager>, res: Response) => {
  try{
    return res.json({
      data: await vendorRepo.find()
    })
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_createVendor = async (req: AuthReq<Manager>, res: Response) => {
  try{
    const body = CreateVendorBody.safeParse(req.body);

    if(!body.success){
      return BodyError(res, body.error.errors);
    };

    const ExistingVendor = await vendorRepo.findOne({
      where: {
        role: body.data.role
      }
    });

    if(ExistingVendor){
      return res.status(409).json({
        status: 409,
        message: "vendor already exists"
      })
    };

    const newVendor = await vendorRepo.save(
      vendorRepo.create({
       ...body.data,
        user: { id: req.userData.id },
        orders: [],
      })
    );

    if(!newVendor){
      return res.status(500).json({
        status: 500,
        message: "Failed to create vendor"
      });
    };

    return res.status(200).json({
      status: 200,
      data: newVendor
    });
  }
  catch(e){
    return Error500(res, e);
  }
};

export const M_deleteVendor = async (req: AuthReq<Manager>, res: Response) => {
  try{
    const body = CreateVendorBody.safeParse(req.body);

    if(!body.success){
      return BodyError(res, body.error.errors);
    }

    const existingVendor = await vendorRepo.findOne({
      where: {
        role: body.data.role
      }
    });

    if(!existingVendor){
      return res.status(404).json({
        status: 404,
        message: "vendor not found"
      })
    };

    const deleteVendor = await vendorRepo.delete(existingVendor?.id);

    if(!deleteVendor){
      return res.status(500).json({
        status: 500,
        message: "Failed to delete vendor"
      });
    };

    return res.json({
      status: 200,
      message: "Successfully deleted vendor"
    });
  }
  catch(e){
    return Error500(res, e);
  }
}
