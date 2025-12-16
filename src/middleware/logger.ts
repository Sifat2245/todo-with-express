import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `[${new Date().toISOString()}] method ${req.method} url ${req.url}`
  );
  next();
};