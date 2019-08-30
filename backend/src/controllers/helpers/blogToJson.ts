import { BlogToJson } from "../interface";

export const blogToJson = (blog: any): BlogToJson => {
  return {
    id: blog.id,
    title: blog.title,
    description: blog.description,
    createdAt: blog.createdAt,
    author: {
      id: blog["Author.id"],
      name: blog["Author.name"],
      username: blog["Author.username"],
      avatar: blog["Author.Profile.avatar"]
    }
  };
};
