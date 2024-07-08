import { z } from "zod";

export const CreateUserBody = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
  role: z.enum(["superAdmin", "endUser"]),
  endUserData: z
    .object({
      age: z.number(),
      address: z.string(),
      name: z.string(),
      phoneNumber: z.string(),
    })
    .optional(),
});

export const LoginUserBody = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.enum([
    "superAdmin",
    "admin",
    "developer",
    "manager",
    "endUser",
    "storeManager",
    "vendor",
  ]),
});

export const createAdminBody = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
  role: z.enum(["CEO", "CTO", "COO"]),
});

export const createStoreBody = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  isOpen: z.boolean().default(false),
  since: z.string(),
});

export const SetUpBody = z.object({
  password: z.string(),
});

export const payBillBody = z.object({
  price: z.string().min(1),
  method: z.enum(["UPI", "NET-BANKING", "D-CARD", "C-CARD", "CASH"]),
});

export const createManagerBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
  joinAt: z.string(),
  salary: z.string().min(1),
  age: z.number().min(1),
  address: z.string().min(1),
  bond: z.string(),
  doc: z.array(
    z.object({
      name: z.string(),
      link: z.string().base64(),
    })
  ),
});

export const deleteManagerBody = z.object({
  id: z.number().min(1),
});

export const createItemBody = z.object({
  name: z.string().min(1),
  des: z.string().min(1),
  price: z.string().min(1),
  images: z.array(
    z.object({
      w: z.number().min(1),
      h: z.number().min(1),
      url: z.string().base64(),
    })
  ),
});

export const StoreManageReqOrderBody = z.object({
  status: z.enum(["REQ", "CANCEL", "DELIVERY"]),
  itemsId: z.array(z.number()),
  orderId: z.number().optional(),
});

export const CreateDeliveryPartnerBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
  joinAt: z.string(),
  salary: z.string(),
  age: z.number(),
  address: z.string(),
  bond: z.string(),
  doc: z.array(
    z.object({
      name: z.string(),
      link: z.string().base64(),
    })
  ),
});

export const CreateStoreManagerBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
  joinAt: z.date(),
  salary: z.string(),
  age: z.number(),
  address: z.string(),
  bond: z.string(),
  doc: z.array(       //aditya:- doc object array ke andar hona chahiye maine galti ki ki object ko array k andar nahi likha.
    z.object({
      name: z.string(),
      link: z.string().base64(),
    })
  )
});

export const CreateStoreBody = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  isOpen: z.boolean().default(false),
  since: z.date(),
});

export const CreateVendorBody = z.object({
  role: z.string().min(1)
})
