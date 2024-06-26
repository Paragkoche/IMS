import { Response } from "express";
export const Error500 = (res: Response, error: unknown) => {
  console.log(error);
  return res.status(500).json({
    status: 500,
    message: "internal server error",
  });
};
