import type { Response, NextFunction } from "express";
import { verifyToken } from "../lib";
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
import { AuthReq } from "../types/para";
export const checkAuth = async (
  req: AuthReq<any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "UN-AUTH",
      });
    }
    const deCodeToken = atob(token);
    const validToken = verifyToken(deCodeToken);

    if (typeof validToken == "string" || typeof validToken == "boolean") {
      return res.status(401).json({
        status: 401,
        message: "UN-AUTH",
        error: validToken,
      });
    }
    const { id, role } = validToken;
    const user = await UserRepo.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "UN-AUTH",
      });
    }
    let roleData = null;
    let data = null;
    switch (role) {
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
    req.userData = user;
    req.roleData = roleData;
    req.role = role;
    return next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "internal server error",
    });
  }
};
