import type { Request } from "express";
import { User } from "../model";
export type userRole =
  | "superAdmin"
  | "admin"
  | "developer"
  | "manager"
  | "endUser"
  | "storeManager"
  | "vendor";

export interface AuthReq<T> extends Request {
  userData: User;
  roleData: T;
  role: userRole;
}
