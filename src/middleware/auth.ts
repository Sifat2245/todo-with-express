import { NextFunction, Request, Response } from "express";
import jwt, { decode, JwtPayload } from "jsonwebtoken";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      console.log(decoded);
      req.user = decoded ;

      if(roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }
      return next();

    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;
