import React from "react";
import styled from "styled-components";
import { Card, FormButton } from "../theme";
import axios from "axios";
import Error from "../components/Error";
import { SubmitProfile as IFormInput } from "../types/inteface";
import { ErrorResponse, OKResponse } from "../types/types";
import { navigate } from "@reach/router";

import {
  useCurrentUserState,
  useCurrentUserDispatch,
  getProfile
} from "../context/current-user-context";
import { useAuthState } from "../context/auth-context";

const Manage = (): JSX.Element => {
  const userState = useCurrentUserState();
  const userDispatch = useCurrentUserDispatch();
  const authState = useAuthState();

  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [text, setText] = React.useState<IFormInput>({
    firstName: "",
    lastName: "",
    avatar: ""
  });

  React.useMemo(() => {
    if (userState.profile) {
      setText({
        firstName: userState.profile.firstName,
        lastName: userState.profile.lastName,
        avatar: userState.profile.avatar
      });
    }
  }, [userState]);

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText({ ...text, [e.target.name]: e.target.value });
  };

  const manageProfile = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:5000/profile/manage",
        {
          firstName: text.firstName,
          lastName: text.lastName,
          avatar: text.avatar
        },
        { headers: { authorization: authState.token } }
      )
      .then((res: OKResponse) => {
        if (res && res.data.message) {
          navigate("/profile");
          getProfile(authState.token, userDispatch);
        }
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
      <Card height="80%" width="60%">
        <Inner>
          <Header>Manage Profile</Header>
          <div>
            <Form onSubmit={manageProfile}>
              <FormControl>
                <label htmlFor="firstName">First Name</label>
                <input
                  autoFocus
                  autoComplete="off"
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  onChange={onChange}
                  value={text.firstName}
                  required
                  name="firstName"
                />
              </FormControl>
              <FormControl>
                <label htmlFor="lastName">Last Name</label>
                <input
                  autoComplete="off"
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  onChange={onChange}
                  value={text.lastName}
                  required
                  name="lastName"
                />
              </FormControl>
              <FormControl>
                <label htmlFor="avatar">Avatar's Link</label>
                <input
                  autoComplete="off"
                  type="text"
                  id="avatar"
                  placeholder="Avatar's Link"
                  onChange={onChange}
                  value={text.avatar}
                  required
                  name="avatar"
                />
              </FormControl>
              <FormControl>
                <FormButton>Proceed</FormButton>
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
    width: 35vw;
    background-color: #ccc;
    border-radius: 8px;
    border: none;
    font-size: 17px;
  }
`;

export default Manage;

// https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500
