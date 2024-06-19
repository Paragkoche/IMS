import * as models from "../model";
import { db } from "./conn.db";


export const UserRepo = db.getRepository(models.User);
export const superAdminRepo = db.getRepository(models.SuperAdmin);
export const adminRepo = db.getRepository(models.Admin);
export const managerRepo = db.getRepository(models.Manager);
export const vendorRepo = db.getRepository(models.Vendor);
export const developerRepo = db.getRepository(models.Developer);
export const endUserRepo = db.getRepository(models.EndUser);
