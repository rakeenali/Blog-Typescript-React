import React from "react";
import styled from "styled-components";
import axios from "axios";
import Error from "../components/Error";
import { useAuthState } from "../context/auth-context";

import { ErrorResponse, BlogResponse } from "../types/types";
import { Card, FormButton } from "../theme";
import { navigate } from "@reach/router";

interface IFormInput {
  title: string;
  description: string;
}

const AddBlog = (): JSX.Element => {
  const authState = useAuthState();
  const [text, setText] = React.useState<IFormInput>({
    title: "",
    description: ""
  });
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText({ ...text, [e.target.name]: e.target.value });
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const addBlog = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/blog",
        { title: text.title, description: text.description },
        {
          headers: {
            authorization: authState.token
          }
        }
      )
      .then((res: BlogResponse) => {
        navigate("/profile");
      })
      .catch((err: ErrorResponse) => {
        if (err.response) {
          setShowError(true);
          setErrorMessage(err.response.data.error);
        }
      });
  };

  return (
    <Center>
      {showError && <Error message={errorMessage} closeError={closeError} />}
      <Card height="480px" width="80%">
        <Inner>
          <Header>Publish Your Blog</Header>
          <div>
            <Form onSubmit={addBlog}>
              <FormControl>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Title"
                  name="title"
                  value={text.title}
                  required
                  onChange={onChange}
                />
              </FormControl>
              <FormControl>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Description"
                  name="description"
                  rows={6}
                  value={text.description}
                  required
                  onChange={onChange}
                />
              </FormControl>
              <FormControl>
                <FormButton>Publish</FormButton>
              </FormControl>
            </Form>
          </div>
        </Inner>
      </Card>
    </Center>
  );
};

const Center = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Inner = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const Header = styled.h1`
  flex-basis: 20%;
  font-size: 40px;
`;
const Form = styled.form`
  flex-basis: 80%;
  height: 100%;
  width: 100%;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;

  label {
    font-size: 20px;
    margin-bottom: 10px;
    text-align: center;
  }

  input,
  textarea {
    outline-color: red;
    padding: 10px;
    width: 50vw;
    background-color: #ccc;
    border-radius: 8px;
    border: none;
    font-size: 17px;
  }
`;

export default AddBlog;
