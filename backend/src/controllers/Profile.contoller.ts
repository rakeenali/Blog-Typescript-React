import { Response, Request } from "express";
import { controller, Post, use, Get } from "../decorators/common";

import { User } from "../models/User";
import { Profile as UserProfile } from "../models/Profile";
import { Blog } from "../models/Blog";

import { ProfileRequest, AuthenticatedRequest } from "./interface";
import { profileValidation } from "./validationSchemas";
import { validate } from "./middlewares/validate";
import { isAuthenticated } from "./middlewares/isAutenticated";

import { userToJson } from "./helpers/userToJson";

@controller("/profile")
class Profie {
  @Post("/manage")
  @use(isAuthenticated)
  @use(validate(profileValidation))
  async manageProfile(req: ProfileRequest, res: Response): Promise<any> {
    try {
      const user = await User.findByPk(req.user.id);
      const {
        firstName,
        lastName,
        avatar = req.body.avatar ? req.body.avatar : null
      } = req.body;

      if (user) {
        const exist = await user.getProfile();

        if (exist) {
          await exist.update({
            firstName,
            lastName,
            avatar
          });
          await user.setProfile(exist);
          return res.status(201).json({
            message: "Profile updated successfully"
          });
        }

        await user.createProfile({
          firstName,
          lastName,
          avatar
        });

        return res.status(201).json({
          message: "Profile created successfully"
        });
      }

      return res.status(404).json({ error: "User not found" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  @Get("/current")
  @use(isAuthenticated)
  async currentLoggedInUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log("fetching profile");
      const user = await User.findByPk(req.user.id, {
        include: [{ model: UserProfile, as: "Profile" }]
      });

      if (user) {
        const blogs = await Blog.findAll({
          where: {
            author: user.id
          },
          order: [["createdAt", "DESC"]],
          raw: true
        });

        const plainUser = user.get({ plain: true });

        const userJson = userToJson(plainUser, blogs);
        return res.status(200).json(userJson);
      }

      return res.status(404).json({ error: "User not found" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  @Get("/:username")
  @use(isAuthenticated)
  async findUser(req: Request, res: Response): Promise<any> {
    try {
      const { username } = req.params;

      if (!username) {
        throw new Error("Username field must be defined");
      }

      const user = await User.findOne({
        where: {
          username
        },
        include: [{ model: UserProfile, as: "Profile" }]
      });

      if (!user) {
        throw new Error(`User with username "${username}" doesnot exisit`);
      }

      const blogs = await user.getBlog({ raw: true });

      const plainUser = user.get({ plain: true });

      const transform = userToJson(plainUser, blogs);
      return res.status(200).json(transform);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}
