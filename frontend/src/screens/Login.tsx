import React from "react";
import styled from "styled-components";
import axios from "axios";

import { useAuthDispatch, setUserAction } from "../context/auth-context";
import { ErrorResponse, LoginResponse } from "../types/types";
import Error from "../components/Error";
import { Card, FormButton } from "../theme";

interface ILoginForm {
  username: string;
  password: string;
}

export default function Login(): JSX.Element {
  const [text, setText] = React.useState<ILoginForm>({
    username: "",
    password: ""
  });
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const dispatch = useAuthDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText({ ...text, [e.target.name]: e.target.value });
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/auth/login", {
        username: text.username,
        password: text.password
      })
      .then((res: LoginResponse) => {
        setUserAction(res.data.token, dispatch);
      })
      .catch((err: ErrorResponse) => {
        if (err && err.response) {
          setShowError(true);
          setErrorMessage(err.response.data.error);
        }
      });
  };

  return (
    <Center>
      {showError && <Error message={errorMessage} closeError={closeError} />}
      <Card height="380px" width="40%">
        <Inner>
          <Header>Login</Header>
          <div>
            <Form onSubmit={login}>
              <FormControl>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  name="username"
                  value={text.username}
                  required
                  onChange={onChange}
                />
              </FormControl>
              <FormControl>
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={text.password}
                  required
                  onChange={onChange}
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
