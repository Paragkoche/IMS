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
import { AuthReq, userRole } from "../types/para";
import { Error500 } from "./errorhandler.helper";

export const checkRole = async (
  role: userRole | null,
  repo:
    | typeof superAdminRepo
    | typeof adminRepo
    | typeof developerRepo
    | typeof endUserRepo
    | typeof managerRepo
    | typeof vendorRepo
    | typeof storeManagerRepo
    | null,
  userId: number
) => {
  if (repo == null) return [false, null];
  let data = await repo.findOne({
    where: {
      user: {
        id: userId,
      },
    },
  });

  return [role !== null && data !== null, data];
};
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
    const { id, role }: { id: number; role: userRole } | any = validToken;
    const user = await UserRepo.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "UN-AUTH",
      });
    }

    const [isValidRole, roleData] = await checkRole(
      role,
      role == "superAdmin"
        ? superAdminRepo
        : role == "admin"
        ? adminRepo
        : role == "developer"
        ? developerRepo
        : role == "endUser"
        ? endUserRepo
        : role == "manager"
        ? managerRepo
        : role == "storeManager"
        ? storeManagerRepo
        : role == "vendor"
        ? vendorRepo
        : null,
      user.id
    );
    if (!isValidRole || !roleData) {
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
    return Error500(res, e);
  }
};
