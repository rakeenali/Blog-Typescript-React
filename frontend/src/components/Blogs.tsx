import React from "react";
import styled from "styled-components";
import { navigate } from "@reach/router";

import { Theme } from "../theme";
import { Blog } from "../types/inteface";

interface Props {
  blogs: Blog[];
  username?: string;
}

const Blogs = (props: Props): JSX.Element => {
  const goTo = (id: number): void => {
    navigate(`/blog/${id}`);
  };

  const renderBlogs = (): JSX.Element[] => {
    return props.blogs.map(blog => {
      return (
        <BlogContainer key={blog.id} onClick={() => goTo(blog.id)} className="blog-area">
          <h1>{blog.title}</h1>
          <p>{blog.description.substr(0, 100)}</p>
          <div>
            <span>{new Date(blog.createdAt).toDateString()}</span>
            {props.username && (
              <span>
                Written By: <Title>{props.username}</Title>
              </span>
            )}
          </div>
        </BlogContainer>
      );
    });
  };

  if (props.blogs.length <= 0) {
    return (
      <Container>
        <Center>
          <h1>No blogs to show</h1>
        </Center>
      </Container>
    );
  }

  return <Container>{renderBlogs()}</Container>;
};

const Container = styled.section`
  min-height: calc(100vh - 15px);
  height: auto;
  width: 70vw;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const Center = styled.div`
  width: 100%;
  margin-top: 10px;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlogContainer = styled.div`
  width: 90%;
  margin: 5px auto;
  padding: 20px 10px;
  color: #ccc;
  font-weight: bolder;
  /* border-bottom: 1px solid ${Theme.primaryColor}; */
  border-bottom: 1px solid #cccccc7a;
  cursor: pointer;
  transition: all 0.3s ease-out;

  &:hover {
    box-shadow: -2px 5px 10px 4px ${Theme.primaryColor};
    border-bottom: none;
    border-radius: 4px;
    transform: scale(1.01);
    transition: all 0.3s ease-out;
  }

  &:active {
    transform: scale(0.99);    
  }

  h1 {
    text-align: center;
    margin-bottom: 15px;
    color: ${Theme.primaryColor};
  }

  div {
    margin-top: 20px;
    padding: 0 5px;
    display:flex;
    justify-content: space-between;
  }
`;

const Title = styled.span`
  color: #eee;
`;

export default Blogs;
