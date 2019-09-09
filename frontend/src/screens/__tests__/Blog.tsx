import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import {
  render,
  fireEvent,
  wait,
  waitForDomChange
} from "@testing-library/react";
import axios from "axios";
import { navigate } from "@reach/router";

import { detailBlog as DetailBlog } from "../../test/buildBlog";
import { getUser } from "../../test/buildUser";
import * as AuthContext from "../../context/auth-context";
import * as CurrentUserContext from "../../context/current-user-context";
import Blog from "../Blog";

jest.mock("@reach/router", () => {
  const navigate = jest.fn();
  return {
    navigate
  };
});

beforeEach(() => {
  jest.spyOn(axios, "delete").mockImplementation((...args) => {
    console.warn("axios.delete is not mocked for this call", ...args);
    return Promise.reject(new Error("This must be mocked!"));
  });
  jest.spyOn(axios, "get").mockImplementation((...args) => {
    console.warn("axios.get is not mocked for this call", ...args);
    return Promise.reject(new Error("This must be mocked!"));
  });
});

afterEach(() => {
  const getAxios = axios.get as jest.Mock;
  const deleteAxios = axios.delete as jest.Mock;
  getAxios.mockClear();
  deleteAxios.mockClear();
});

describe("<Blog />", () => {
  test("renders loading and blog correctly", async () => {
    const axiosGet = axios.get as jest.Mock;

    const detailBlog = DetailBlog();
    axiosGet.mockResolvedValueOnce({
      data: { ...detailBlog }
    });

    const { queryByText } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserProvider>
          <Blog id="1" />
        </CurrentUserContext.CurrentUserProvider>
      </AuthContext.AuthProvider>
    );

    expect(queryByText("loading")).toBeInTheDocument();

    await waitForDomChange();
    expect(queryByText(detailBlog.title)).toBeInTheDocument();
    expect(queryByText(detailBlog.author.username)).toBeInTheDocument();
    expect(queryByText(detailBlog.description)).toBeInTheDocument();
  });

  test("user can delete blog", async () => {
    const axiosGet = axios.get as jest.Mock;
    const axiosDelete = axios.delete as jest.Mock;

    const user = getUser();
    const detailBlog = DetailBlog({
      author: {
        avatar: "avatar",
        id: user.userId,
        name: user.name,
        username: user.username
      }
    });
    axiosGet.mockResolvedValueOnce({
      data: { ...detailBlog }
    });

    const { queryByText } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserStateContext.Provider value={user}>
          <Blog id="1" />
        </CurrentUserContext.CurrentUserStateContext.Provider>
      </AuthContext.AuthProvider>
    );

    expect(queryByText("loading")).toBeInTheDocument();

    await waitForDomChange();

    axiosDelete.mockResolvedValueOnce({
      data: {
        message: "Post deleted"
      }
    });

    const deleteButton = queryByText("Delete");

    deleteButton && fireEvent.click(deleteButton);

    await wait(
      () => {
        expect(navigate).toHaveBeenCalledTimes(1);
      },
      { timeout: 100 }
    );
  });

  test("can update blog", async () => {
    const axiosGet = axios.get as jest.Mock;

    const user = getUser();
    const detailBlog = DetailBlog({
      author: {
        avatar: "avatar",
        id: user.userId,
        name: user.name,
        username: user.username
      }
    });

    axiosGet.mockResolvedValueOnce({
      data: { ...detailBlog }
    });

    const { queryByText, debug, getByPlaceholderText } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserStateContext.Provider value={user}>
          <Blog id="1" />
        </CurrentUserContext.CurrentUserStateContext.Provider>
      </AuthContext.AuthProvider>
    );

    expect(queryByText("loading")).toBeInTheDocument();

    await waitForDomChange();

    const updateButton = queryByText("Update");
    updateButton && fireEvent.click(updateButton);

    await wait(
      () => {
        expect(queryByText("Update Your Blog")).toBeInTheDocument();
        const title = getByPlaceholderText("Title") as HTMLInputElement;
        const description = getByPlaceholderText(
          "Description"
        ) as HTMLInputElement;

        expect(description.value).toEqual(detailBlog.description);
        expect(title.value).toEqual(detailBlog.title);
      },
      { timeout: 100 }
    );
  });
});
