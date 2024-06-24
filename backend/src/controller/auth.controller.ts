import type { Request, Response } from "express";
import { CreateUserBody, LoginUserBody } from "../helper";
import {
  UserRepo,
  adminRepo,
  developerRepo,
  endUserRepo,
  managerRepo,
  storeManagerRepo,
  superAdminRepo,
  vendorRepo,
} from "../db/repo.db";
import { createToken } from "../lib";
import { AuthReq } from "../types/para";

export const UserRegister = async (req: Request, res: Response) => {
  try {
    const body = CreateUserBody.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    }
    if (body.data.role == "endUser" && body.data.endUserData == undefined) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: "role data requited!!",
      });
    }
    const user = await UserRepo.findOne({
      where: {
        email: body.data.email,
      },
    });
    if (user) {
      return res.status(403).json({
        status: 403,
        message: "email id already exited!!!",
      });
    }
    const newUser = await UserRepo.save(
      UserRepo.create({
        ...body.data,
      })
    );
    let roleData = null;
    if (body.data.role == "superAdmin") {
      roleData = await superAdminRepo.save(
        superAdminRepo.create({
          user: {
            id: newUser.id,
          },
        })
      );
    } else if (body.data.role == "endUser") {
      roleData = await endUserRepo.save(
        endUserRepo.create({
          ...body.data.endUserData,
          user: {
            id: newUser.id,
          },
        })
      );
    }
    if (roleData == null) {
      return res.status(500).json({
        status: 500,
        message: "internal server error",
      });
    }
    res.cookie("token", createToken({ id: newUser.id, role: body.data.role }), {
      path: "/",
      httpOnly: true,
      encode: btoa,
      expires: new Date(new Date().setDate(new Date().getDate() + 30)),
    });
    return res.json({
      data: {
        userData: newUser,
        roleData,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "internal server error",
    });
  }
};
export const UserLogin = async (req: Request, res: Response) => {
  try {
    const body = LoginUserBody.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({
        status: 400,
        message: "invalid body",
        error: body.error.errors,
      });
    }
    const user = await UserRepo.findOne({
      where: {
        email: body.data.email,
      },
    });
    if (!user) {
      return res.status(403).json({
        status: 403,
        message: "email id  Not found!!!",
      });
    }
    const isValidPassword = await user.checkPassword(body.data.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 401,
        message: "password invalid",
      });
    }
    let roleData = null;
    let data = null;
    switch (body.data.role) {
      case "superAdmin":
        data = await superAdminRepo.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!data) {
          return res.status(401).json({
            status: 401,
            message: "Role data not found!!",
          });
        }
        roleData = data;
        break;
      case "admin":
        data = await adminRepo.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!data) {
          return res.status(401).json({
            status: 401,
            message: "Role data not found!!",
          });
        }
        roleData = data;
        break;
      case "developer":
        data = await developerRepo.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!data) {
          return res.status(401).json({
            status: 401,
            message: "Role data not found!!",
          });
        }
        roleData = data;
        break;
      case "endUser":
        data = await endUserRepo.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!data) {
          return res.status(401).json({
            status: 401,
            message: "Role data not found!!",
          });
        }
        roleData = data;
        break;
      case "manager":
        data = await managerRepo.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!data) {
          return res.status(401).json({
            status: 401,
            message: "Role data not found!!",
          });
        }
        roleData = data;
        break;
      case "storeManager":
        data = await storeManagerRepo.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!data) {
          return res.status(401).json({
            status: 401,
            message: "Role data not found!!",
          });
        }
        roleData = data;
        break;
      case "vendor":
        data = await vendorRepo.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!data) {
          return res.status(401).json({
            status: 401,
            message: "Role data not found!!",
          });
        }
        roleData = data;
        break;
      default:
        roleData = null;
        data = null;
        break;
    }
    if (roleData == null) {
      return res.status(401).json({
        status: 401,
        message: "Role data not found!!",
      });
    }

    res.cookie("token", createToken({ id: user.id, role: body.data.role }), {
      path: "/",
      httpOnly: true,
      encode: btoa,
      expires: new Date(new Date().setDate(new Date().getDate() + 30)),
    });
    return res.json({
      status: 200,
      data: {
        user: user.toJson(),
        roleData,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "internal server error",
    });
  }
};
export const UserLogOut = (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.json({
      status: 200,
      message: "ok",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "internal server error",
    });
  }
};

export const refToken = (req: AuthReq<any>, res: Response) => {
  try {
    res.cookie("token", createToken({ id: req.userData.id, role: req.role }), {
      path: "/",
      httpOnly: true,
      encode: btoa,
      expires: new Date(new Date().setDate(new Date().getDate() + 30)),
    });
    return res.json({
      message: "ok",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "internal server error",
    });
  }
};
