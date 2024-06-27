import * as models from "../model";
import { db } from "./conn.db";

export const UserRepo = db.getRepository(models.User);
export const superAdminRepo = db.getRepository(models.SuperAdmin);
export const adminRepo = db.getRepository(models.Admin);
export const managerRepo = db.getRepository(models.Manager);
export const vendorRepo = db.getRepository(models.Vendor);
export const developerRepo = db.getRepository(models.Developer);
export const endUserRepo = db.getRepository(models.EndUser);
export const storeManagerRepo = db.getRepository(models.StoreManager);
export const orderRepo = db.getRepository(models.Orders);
export const storeRepo = db.getRepository(models.Store);
export const storeOrderRepo = db.getRepository(models.StoreOrders);
export const w_cardRepo = db.getRepository(models.WCard)
export const itemsRepo = db.getRepository(models.Items);
export const itemsImagesRepo = db.getRepository(models.ItemsImages)
export const employeeDocRepo = db.getRepository(models.Doc)
export const deliveryPartnerRepo = db.getRepository(models.deliveryPartner);
export const billsRepo = db.getRepository(models.bills);
export const orderPaymentRepo = db.getRepository(models.Order_payment);
export const ticketRepo = db.getRepository(models.ticket);
