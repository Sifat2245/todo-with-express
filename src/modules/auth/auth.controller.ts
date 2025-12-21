import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await authService.loginUser(email, password);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "something went wrong",
    });
  }
};

export const authController = {
  loginUser,
};
