import { Response } from "express";
import { controller, Post, use } from "../decorators/common";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { RegisterRequest, LoginRequest } from "./interface";
import { registerValidation, loginValidation } from "./validationSchemas";
import { validate } from "./middlewares/validate";

// middlewares will execute in top to down order
@controller("/auth")
class Auth {
  @Post("/register")
  @use(validate(registerValidation))
  async register(req: RegisterRequest, res: Response): Promise<any> {
    try {
      const { password, username, name } = req.body;
      const genSalt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, genSalt);

      const exist = await User.findOne({ where: { username } });

      if (exist) {
        throw new Error(
          `User with username of ${username} already exist try another one`
        );
      }

      const user = await User.create({
        name,
        username,
        password: hashPassword
      });
      if (user) {
        return res.status(200).json({
          message: "User created"
        });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  @Post("/login")
  @use(validate(loginValidation))
  async login(req: LoginRequest, res: Response): Promise<any> {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({
        where: { username },
        raw: true
      });

      if (user) {
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.status(404).json({
            error: `Invalid username or password`
          });
        }

        const token = jwt.sign({ username, id: user.id }, "secret", {
          expiresIn: "7d",
          noTimestamp: true
        });

        return res.status(200).json({
          token
        });
      }

      return res.status(404).json({
        error: `Invalid username or password`
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
