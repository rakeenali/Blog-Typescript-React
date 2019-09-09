import "@testing-library/jest-dom/extend-expect";

import * as React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import axios from "axios";

import * as AuthContext from "../../context/auth-context";
import Login from "../Login";

beforeEach(() => {
  jest.spyOn(axios, "post").mockImplementation((...args) => {
    console.warn("axios.post is not mocked for this call", ...args);
    return Promise.reject(new Error("This must be mocked!"));
  });
});

afterEach(() => {
  const mockAxios = axios.post as jest.Mock;
  mockAxios.mockClear();
});

describe("<Login/>", () => {
  test("renders the form correcty", () => {
    const { container } = render(
      <AuthContext.AuthProvider>
        <Login />
      </AuthContext.AuthProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("renders the form changes correctly", () => {
    const usernameText = "rakeen";
    const passwordText = "rakeen";
    const { getByPlaceholderText } = render(
      <AuthContext.AuthProvider>
        <Login />
      </AuthContext.AuthProvider>
    );
    const username = getByPlaceholderText(/Username/i) as HTMLInputElement;
    const password = getByPlaceholderText(/Password/i) as HTMLInputElement;

    fireEvent.change(username, {
      target: { value: usernameText }
    });

    fireEvent.change(password, {
      target: { value: passwordText }
    });

    expect(username.value).toEqual(usernameText);
    expect(password.value).toEqual(passwordText);
  });

  test("login user successfuly", async () => {
    const usernameText = "rakeen";
    const passwordText = "rakeen";
    const axioPost = axios.post as jest.Mock;
    AuthContext.setUserAction = jest.fn();

    const { getByPlaceholderText, queryByText } = render(
      <AuthContext.AuthProvider>
        <Login />
      </AuthContext.AuthProvider>
    );
    const username = getByPlaceholderText(/Username/i) as HTMLInputElement;
    const password = getByPlaceholderText(/Password/i) as HTMLInputElement;

    fireEvent.change(username, {
      target: { value: usernameText }
    });

    fireEvent.change(password, {
      target: { value: passwordText }
    });

    axioPost.mockResolvedValueOnce({
      status: 200,
      data: {
        token: "jwt-token"
      }
    });
    const submitButton = queryByText(/Submit/i);

    if (submitButton) {
      fireEvent.click(submitButton);
    }

    await wait(
      () => {
        expect(AuthContext.setUserAction).toHaveBeenCalledTimes(1);
      },
      { timeout: 100 }
    );
  });

  test("invalid form submission throw error", async () => {
    const usernameText = "rakeen";
    // const passwordText = "rakeen";
    const axiosPost = axios.post as jest.Mock;

    const { getByPlaceholderText, queryByText } = render(
      <AuthContext.AuthProvider>
        <Login />
      </AuthContext.AuthProvider>
    );
    const username = getByPlaceholderText(/Username/i) as HTMLInputElement;

    fireEvent.change(username, {
      target: { value: usernameText }
    });

    axiosPost.mockRejectedValueOnce({
      response: {
        data: {
          error: "Password field is required"
        }
      }
    });

    const submitButton = queryByText(/Submit/i);

    if (submitButton) {
      fireEvent.click(submitButton);
    }

    await wait(
      () => {
        expect(queryByText(/Password field is required/i)).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
