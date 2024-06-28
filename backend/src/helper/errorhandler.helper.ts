import { Response } from "express";
import { ZodError } from "zod";
export const Error500 = (res: Response, error: unknown) => {
  console.log(error);
  return res.status(500).json({
    status: 500,
    message: "internal server error",
  });
};

export const BodyError = (res: Response, errors: ZodError[] | any) => {
  return res.status(400).json({
    status: 400,
    message: "invalid body",
    errors: errors,
  });
};
