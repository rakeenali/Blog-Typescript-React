import { Request, Response, NextFunction } from "express";
import { Schema, ValidationError } from "@hapi/joi";

export const validate = (schema: Schema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  schema.validate(req.body, (err: ValidationError) => {
    if (err) {
      const error = err.details.reduce((prev: string, curr) => {
        if (prev.trim() !== "") {
          return (prev = `${prev}, ${curr.message}`);
        }
        return `${curr.message}`;
      }, "");
      res.status(500).json({
        error
      });
      return;
    } else {
      next();
    }
  });
};
