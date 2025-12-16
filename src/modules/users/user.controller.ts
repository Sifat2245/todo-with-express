import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  console.log(req.body);

  const { name, email, age, address } = req.body;

  try {
    const result = await userService.createUser(name, email, age, address);
    console.log(result.rows[0]);
    res.status(201).json({
      message: "user stored successfully",
      success: true,
      data: result.rows[0],
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "something went wrong",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUser();

    res.status(200).json({
      status: true,
      message: "Users received successfully",
      data: result?.rows,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUser(id!);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User received successfully",
      data: result?.rows[0],
    });
  } catch (err: any) {
    console.log(err);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.updateUser(
      req.body.name,
      req.body.email,
      req.body.age,
      req.body.address,
      req.params.id!
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: result?.rows[0],
    });
  } catch (err: any) {
    console.log(err);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.id!);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User Deleted successfully",
      data: null,
    });
  } catch (err: any) {
    console.log(err);
  }
}

export const userController = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
