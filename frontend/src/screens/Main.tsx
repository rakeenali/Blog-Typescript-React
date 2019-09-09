import React from "react";
import axios, { AxiosResponse } from "axios";

import Blogs from "../components/Blogs";
import { Blog as IBlog } from "../types/inteface";
import { ErrorResponse } from "../types/types";

const Main = (): JSX.Element => {
  const [blogs, setBlogs] = React.useState<IBlog[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useLayoutEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/blog")
      .then((res: AxiosResponse<any[]>) => {
        if (res.data) {
          const mappedBlogs: IBlog[] = res.data.map(blog => {
            return {
              id: blog.id,
              title: blog.title,
              description: blog.description,
              createdAt: blog.createdAt
            };
          });
          setLoading(false);
          setBlogs(mappedBlogs);
        }
      })
      .catch((err: ErrorResponse) => {
        if (err.response) {
          setLoading(false);
          throw new Error(err.response.data.error);
        }
      });
  }, []);

  if (loading) {
    return (
      <div>
        <h2>loading</h2>
      </div>
    );
  }

  if (blogs && blogs.length > 0) {
    return (
      <>
        <Blogs blogs={blogs} />
      </>
    );
  }

  return <></>;
};

export default Main;
