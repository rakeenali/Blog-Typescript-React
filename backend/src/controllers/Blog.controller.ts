import { Response, Request } from "express";
import Sequelize from "sequelize";

import { Get, controller, Post, use, Delete } from "../decorators/common";
import { isAuthenticated } from "./middlewares/isAutenticated";
import { validate } from "./middlewares/validate";
import { blogValidation } from "./validationSchemas";
import { BlogRequest, AuthenticatedRequest } from "./interface";

import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { Blog as ModelBlog } from "../models/Blog";

import { manyBlogsToJson } from "./helpers/manyBlogToJson";
import { blogToJson } from "./helpers/blogToJson";

@controller("/blog")
class Blog {
  @Post("")
  @use(isAuthenticated)
  @use(validate(blogValidation))
  async createBlog(req: BlogRequest, res: Response): Promise<any> {
    try {
      const { title, description } = req.body;

      const user = await User.findByPk(req.user.id);

      if (user) {
        const newBlog = await user.createBlog({
          title,
          description,
          createdAt: new Date()
        });

        return res.status(201).json(newBlog.toJSON());
      }

      return res.status(404).json({ error: "User does not exist" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  @Post("/:id")
  @use(isAuthenticated)
  @use(validate(blogValidation))
  async updateBlog(req: BlogRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const {
        title,
        description = req.body.description ? req.body.description : ""
      } = req.body;

      if (!id) {
        throw new Error("Id is required in order to update");
      }

      const blog = await ModelBlog.findByPk(id);

      if (!blog) {
        throw new Error(`Blog with id ${id} does not exist`);
      }

      if (blog.author !== req.user.id) {
        throw new Error(`You are not authorize to update this blog`);
      }

      const newBlog = await blog.update({
        title,
        description
      });

      return res.status(200).json(newBlog.toJSON());
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  @Delete("/:id")
  @use(isAuthenticated)
  async deleteBlog(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error("Id must be defined");
      }

      const blog = await ModelBlog.findByPk(id);

      if (!blog) {
        throw new Error(`Blog with id ${id} does not eixist`);
      }

      if (blog.author !== req.user.id) {
        throw new Error("Invalid delete request entity does not belong to you");
      }

      const author = await blog.getAuthor();
      await blog.destroy();
      await author.removeBlog(blog);

      return res.status(200).json({ message: "Blog deleted" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  @Get("")
  async getBlogs(req: Request, res: Response): Promise<any> {
    try {
      const blog = await ModelBlog.findAll({
        order: [[Sequelize.col("createdAt"), "DESC"]],
        include: [
          {
            model: User,
            as: "Author",
            include: [
              {
                model: Profile,
                as: "Profile"
              }
            ]
          }
        ],
        raw: true
      });

      const result = manyBlogsToJson(blog);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  @Get("/:id")
  async singleBlog(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error("Id must be defined");
      }

      const blog = await ModelBlog.findByPk(id, {
        include: [
          {
            model: User,
            as: "Author",
            include: [
              {
                model: Profile,
                as: "Profile"
              }
            ]
          }
        ],
        raw: true
      });

      if (!blog) {
        throw new Error(`Blog with id ${id} does not exist`);
      }

      const transformBlog = blogToJson(blog);

      return res.status(200).json(transformBlog);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}
