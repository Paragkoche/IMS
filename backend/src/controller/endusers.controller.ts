import { Error500 } from "../helper/errorhandler.helper";
import { EndUser } from "../model";
import { AuthReq } from "../types/para";
import type { Response } from "express";
export const AU_profile = async (req: AuthReq<EndUser>, res: Response) => {
  try {
    return res.json({
      data: {
        user: req.role,
        roleData: req.roleData,
      },
    });
  } catch (e) {
    return Error500(res, e);
  }
};
