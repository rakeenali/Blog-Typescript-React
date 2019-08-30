import React from "react";
import styled from "styled-components";
import axios from "axios";

import { Card, FormButton } from "../theme";
import Error from "../components/Error";
import { ErrorResponse, OKResponse } from "../types/types";
import { navigate } from "@reach/router";

interface IFormInput {
  username: string;
  password: string;
  name: string;
}

export default function Register(): JSX.Element {
  const [text, setText] = React.useState<IFormInput>({
    username: "",
    password: "",
    name: ""
  });

  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText({ ...text, [e.target.name]: e.target.value });
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const registerUser = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/auth/register", {
        name: text.name,
        password: text.password,
        username: text.username
      })
      .then((res: OKResponse) => {
        if (res && res.data.message) {
          navigate("/login");
        }
      })
      .catch((err: ErrorResponse) => {
        if (err && err.response) {
          setErrorMessage(err.response.data.error);
          setShowError(true);
        }
      });
  };

  return (
    <Center>
      {showError && <Error message={errorMessage} closeError={closeError} />}
      <Card height="480px" width="40%">
        <Inner>
          <Header>Register</Header>
          <div>
            <Form onSubmit={registerUser}>
              <FormControl>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  onChange={onChange}
                  value={text.name}
                  required
                  name="name"
                />
              </FormControl>
              <FormControl>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  onChange={onChange}
                  value={text.username}
                  required
                  name="username"
                />
              </FormControl>
              <FormControl>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={onChange}
                  value={text.password}
                  required
                  name="password"
                />
              </FormControl>
              <FormControl>
                <FormButton>Submit</FormButton>
              </FormControl>
            </Form>
          </div>
        </Inner>
      </Card>
    </Center>
  );
}

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
  font-size: 50px;
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

  input {
    outline-color: red;
    padding: 10px;
    width: 25vw;
    background-color: #ccc;
    border-radius: 8px;
    border: none;
    font-size: 17px;
  }
`;
