import React from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import styled from "styled-components";

import UpdateModal from "../components/UpdateModal";
import { Theme } from "../theme";
import { ErrorResponse, DetailBlogResponse, OKResponse } from "../types/types";
import { DetailBlog } from "../types/inteface";
import { useCurrentUserState } from "../context/current-user-context";
import { useAuthState } from "../context/auth-context";

interface Props {
  id?: string;
}

const Blog = (props: Props): JSX.Element => {
  const [blog, setBlog] = React.useState<DetailBlog | null>(null);
  const [own, setOwn] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [update, setUpdate] = React.useState<boolean>(false);

  const userState = useCurrentUserState();
  const authState = useAuthState();

  React.useEffect(() => {
    if (props.id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/blog/${props.id}`)
        .then((res: DetailBlogResponse) => {
          if (res && res.data) {
            setBlog(res.data);
            if (res.data.author.id === userState.userId) {
              setOwn(true);
            }
          }
          setLoading(false);
        })
        .catch((err: ErrorResponse) => {
          if (err && err.response) {
            setLoading(false);
            navigate("/profile");
          }
        });
    }
  }, [props.id, update, userState.userId]);

  const sendToProfile = () => {
    if (blog) {
      navigate(`/profile/${blog.author.username}`);
    }
  };

  const deleteBlog = () => {
    if (blog) {
      axios
        .delete(`http://localhost:5000/blog/${blog.id}`, {
          headers: { authorization: authState.token }
        })
        .then((res: OKResponse) => {
          if (res && res.data) {
            navigate("/profile");
          }
        })
        .catch((err: ErrorResponse) => {
          if (err && err.response) {
            navigate("/profile");
          }
        });
    }
  };

  if (loading) {
    return (
      <div>
        <h2>loading</h2>
      </div>
    );
  }

  if (blog) {
    return (
      <>
        {update && (
          <UpdateModal
            title={blog.title}
            description={blog.description}
            blogId={blog.id}
            token={authState.token}
            onClose={() => setUpdate(false)}
          />
        )}
        <Container>
          <BlogArea>
            <h1>{blog.title}</h1>
            <h2>
              {new Date(blog.createdAt).toDateString()} Created by{" "}
              <span onClick={sendToProfile}>{blog.author.username}</span>
            </h2>
            {own && (
              <div>
                <button onClick={() => setUpdate(true)}>Update</button>
                <button onClick={deleteBlog}>Delete</button>
              </div>
            )}
            <p>{blog.description}</p>
          </BlogArea>
        </Container>
      </>
    );
  }

  return <></>;
};

const Container = styled.section`
  min-height: calc(100vh - 15px);
  height: auto;
  width: 70vw;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const BlogArea = styled.div`
  margin-top: 3rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 3rem;
    margin: 1rem 0;
  }

  h2 {
    font-size: 1rem;
    margin: 1rem 0;

    span {
      color: #eee;
      cursor: pointer;
      transition: all 0.2s ease-out;

      &:hover {
        color: ${Theme.primaryColor};
        text-decoration: underline;
      }
    }
  }

  div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      margin: 1rem 2rem;
      font-size: 1rem;
      padding: 0.6rem 1.3rem;
      border: none;
      background-color: ${Theme.primaryColor};
      color: #eee;
      cursor: pointer;
      transition: all 0.3s ease-out;
      outline: none;

      &:hover {
        transform: translateY(-1px);
        box-shadow: -1px 2px 6px rgba(0, 0, 0, 0.4);
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }

  p {
    margin: 1rem 0;
    font-size: 1.3rem;
  }
`;

export default Blog;
