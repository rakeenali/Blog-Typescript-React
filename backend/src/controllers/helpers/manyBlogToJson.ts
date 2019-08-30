import { ManyBlogResponse } from "../interface";

export const manyBlogsToJson = (blogs: any[]): ManyBlogResponse[] => {
  return blogs.map(blog => {
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
  });
};
