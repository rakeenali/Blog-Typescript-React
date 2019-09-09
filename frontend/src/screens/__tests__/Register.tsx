import "@testing-library/jest-dom/extend-expect";

import * as React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import axios from "axios";
import { navigate } from "@reach/router";

import * as AuthContext from "../../context/auth-context";
import Register from "../Register";

jest.mock("@reach/router", () => {
  const navigate = jest.fn();
  return {
    navigate
  };
});

beforeEach(() => {
  jest.spyOn(axios, "post").mockImplementation((...args) => {
    console.warn("axios.post is not mocked for this call", ...args);
    return Promise.reject(new Error("This must be mocked!"));
  });
});

afterEach(() => {
  const mockNavigate = navigate as jest.Mock;
  const axiosPost = axios.post as jest.Mock;
  mockNavigate.mockClear();
  axiosPost.mockClear();
});

describe("<Register />", () => {
  test("renders correctly", () => {
    const { container } = render(
      <AuthContext.AuthProvider>
        <Register />
      </AuthContext.AuthProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test("render the form changes correctly", () => {
    const usernameText = "rakeen";
    const nameText = "Rakeen";
    const passwordText = "rakeen";

    const { getByPlaceholderText } = render(
      <AuthContext.AuthProvider>
        <Register />
      </AuthContext.AuthProvider>
    );

    const name = getByPlaceholderText("Name") as HTMLInputElement;
    const username = getByPlaceholderText("Username") as HTMLInputElement;
    const password = getByPlaceholderText("Password") as HTMLInputElement;

    fireEvent.change(name, {
      target: { value: nameText }
    });

    fireEvent.change(username, {
      target: { value: usernameText }
    });

    fireEvent.change(password, {
      target: { value: passwordText }
    });

    expect(username.value).toEqual(usernameText);
    expect(password.value).toEqual(passwordText);
    expect(name.value).toEqual(nameText);
  });

  test("register user successfuly", async () => {
    const usernameText = "rakeen";
    const nameText = "Rakeen";
    const passwordText = "rakeen";

    const axiosPost = axios.post as jest.Mock;

    const { getByPlaceholderText, queryByText } = render(
      <AuthContext.AuthProvider>
        <Register />
      </AuthContext.AuthProvider>
    );

    const name = getByPlaceholderText("Name") as HTMLInputElement;
    const username = getByPlaceholderText("Username") as HTMLInputElement;
    const password = getByPlaceholderText("Password") as HTMLInputElement;
    const submitButton = queryByText(/Submit/i);

    fireEvent.change(name, {
      target: { value: nameText }
    });

    fireEvent.change(username, {
      target: { value: usernameText }
    });

    fireEvent.change(password, {
      target: { value: passwordText }
    });

    axiosPost.mockResolvedValueOnce({
      status: 201,
      data: {
        message: "User created"
      }
    });

    submitButton && fireEvent.click(submitButton);

    await wait(
      () => {
        expect(navigate).toHaveBeenCalledTimes(1);
      },
      { timeout: 100 }
    );
  });

  test("invalid form submission throws error", async () => {
    const usernameText = "rakeen";
    const nameText = "Rakeen";

    const axisPost = axios.post as jest.Mock;

    const { getByPlaceholderText, queryByText } = render(
      <AuthContext.AuthProvider>
        <Register />
      </AuthContext.AuthProvider>
    );

    const name = getByPlaceholderText("Name") as HTMLInputElement;
    const username = getByPlaceholderText("Username") as HTMLInputElement;
    const password = getByPlaceholderText("Password") as HTMLInputElement;
    const submitButton = queryByText(/Submit/i);

    fireEvent.change(name, {
      target: { value: nameText }
    });

    fireEvent.change(username, {
      target: { value: usernameText }
    });

    fireEvent.change(password, {
      target: { value: "" }
    });

    axisPost.mockRejectedValueOnce({
      response: {
        data: {
          error: "Password field is required"
        }
      }
    });

    submitButton && fireEvent.click(submitButton);

    await wait(
      () => {
        expect(queryByText(/Password field is required/i)).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
