import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import axios from "axios";
import { navigate } from "@reach/router";

import * as AuthContext from "../../context/auth-context";
import AddBlog from "../AddBlog";

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
  const postAxios = axios.post as jest.Mock;
  postAxios.mockClear();
});

describe("<AddBlog/>", () => {
  test("renders correctly", () => {
    const { container } = render(
      <AuthContext.AuthProvider>
        <AddBlog />
      </AuthContext.AuthProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("renders the form changes correctly", () => {
    const titleText = "Some title";
    const descriptionText = "Some description not about the blog";
    const { getByPlaceholderText } = render(
      <AuthContext.AuthProvider>
        <AddBlog />
      </AuthContext.AuthProvider>
    );
    const title = getByPlaceholderText("Title") as HTMLInputElement;
    const description = getByPlaceholderText("Description") as HTMLInputElement;

    fireEvent.change(title, {
      target: { value: titleText }
    });

    fireEvent.change(description, {
      target: { value: descriptionText }
    });

    expect(title.value).toEqual(titleText);
    expect(description.value).toEqual(descriptionText);
  });

  test("can add blog successfully", async () => {
    const titleText = "Some title";
    const descriptionText = "Some description not about the blog";
    const axiosPost = axios.post as jest.Mock;

    const { getByPlaceholderText, debug, queryByText } = render(
      <AuthContext.AuthProvider>
        <AddBlog />
      </AuthContext.AuthProvider>
    );
    const title = getByPlaceholderText("Title") as HTMLInputElement;
    const description = getByPlaceholderText("Description") as HTMLInputElement;
    const publishButton = queryByText("Publish");

    fireEvent.change(title, {
      target: { value: titleText }
    });

    fireEvent.change(description, {
      target: { value: descriptionText }
    });

    axiosPost.mockResolvedValueOnce({
      status: 201,
      data: {
        id: 1
      }
    });

    publishButton && fireEvent.click(publishButton);

    await wait(
      () => {
        expect(navigate).toHaveBeenCalledTimes(1);
      },
      { timeout: 100 }
    );
  });

  test("show errors correctly", async () => {
    const titleText = "Some title";
    const axiosPost = axios.post as jest.Mock;

    const { getByPlaceholderText, queryByText } = render(
      <AuthContext.AuthProvider>
        <AddBlog />
      </AuthContext.AuthProvider>
    );
    const title = getByPlaceholderText("Title") as HTMLInputElement;
    const description = getByPlaceholderText("Description") as HTMLInputElement;
    const publishButton = queryByText("Publish");

    fireEvent.change(title, {
      target: { value: titleText }
    });

    fireEvent.change(description, {
      target: { value: "" }
    });

    axiosPost.mockRejectedValue({
      response: {
        data: {
          error: "Description field is required"
        }
      }
    });

    publishButton && fireEvent.click(publishButton);

    await wait(
      () => {
        expect(
          queryByText(/Description field is required/i)
        ).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
