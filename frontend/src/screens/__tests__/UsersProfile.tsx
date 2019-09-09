import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { render, waitForDomChange } from "@testing-library/react";
import axios from "axios";
import { navigate } from "@reach/router";

import { getUser } from "../../test/buildUser";
import { generateBlogs } from "../../test/buildBlog";
import * as AuthContext from "../../context/auth-context";
import * as CurrentUserContext from "../../context/current-user-context";
import UsersProfile from "../UsersProfile";

jest.mock("@reach/router", () => {
  const navigate = jest.fn();
  return {
    navigate
  };
});

beforeEach(() => {
  jest.spyOn(axios, "get").mockImplementation((...args) => {
    console.warn("axios.get is not mocked for this call", ...args);
    return Promise.reject(new Error("This must be mocked!"));
  });
});

afterEach(() => {
  const getAxios = axios.get as jest.Mock;
  const navigateMock = navigate as jest.Mock;
  getAxios.mockClear();
  navigateMock.mockClear();
});

describe("<UsersProfile/>", () => {
  test("get profile correctly", async () => {
    const axiosGet = axios.get as jest.Mock;

    const count = 2;
    const blogs = generateBlogs(count);
    const user = getUser({ blogs: blogs });

    axiosGet.mockResolvedValueOnce({
      data: user
    });

    const { queryByText, container } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserProvider>
          <UsersProfile />
        </CurrentUserContext.CurrentUserProvider>
      </AuthContext.AuthProvider>
    );

    expect(queryByText("loading")).toBeInTheDocument();

    await waitForDomChange();

    const blogArea = container.querySelectorAll("section > div");

    blogs.forEach(blog => {
      expect(queryByText(blog.title)).toBeInTheDocument();
    });
    expect(blogArea.length).toEqual(count);
  });

  test("show error if profile doesnot exist", async () => {
    const axiosGet = axios.get as jest.Mock;

    axiosGet.mockRejectedValue({
      response: {
        data: {
          error: "Profile does not exist"
        }
      }
    });

    const { queryByText } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserProvider>
          <UsersProfile />
        </CurrentUserContext.CurrentUserProvider>
      </AuthContext.AuthProvider>
    );

    expect(queryByText("loading")).toBeInTheDocument();

    await waitForDomChange();
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
