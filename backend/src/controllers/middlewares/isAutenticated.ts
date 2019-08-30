import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";

import { AuthenticatedRequest } from "../interface";

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    const verified: any = jwt.verify(token, "secret");

    if (!verified) {
      return res.status(401).json({
        error: "Invalid token"
      });
    }

    const exp = new Date(verified.exp * 1000).getTime();

    const curr: number = Math.floor(new Date().getTime() / 1000);

    if (exp > curr) {
      let user = await User.findByPk(verified.id, { raw: true });

      if (!user) {
        return res.status(401).json({
          error: "Invalid User"
        });
      }

      req.user = {
        username: user.username,
        id: user.id
      };
      next();
    } else {
      return res.status(401).json({
        error: "Token is expired"
      });
    }
  } else {
    return res.status(401).json({
      error: "Authorization token is required"
    });
  }
};
