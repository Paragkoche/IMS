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
  role: z.enum(["CEO","CTO","COO"])
});

export const createStoreBody = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  isOpen: z.boolean().default(false),
  since: z.string()
});

export const payBillBody = z.object({
  price: z.string().min(1),
  method: z.enum(["UPI","NET-BANKING","D-CARD","C-CARD","CASH"]),
});

export const AdminSetUpBody = z.object({
  password: z.string().min(1)
});

export const createManagerBody = z.object({
  name: z.string().min(1),
  joinAt: z.string(),
  salary: z.string().min(1),
  age: z.number().min(1),
  address: z.string().min(1),
  bond: z.string()
})
