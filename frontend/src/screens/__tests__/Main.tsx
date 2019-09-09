import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import axios from "axios";
import { render, waitForDomChange } from "@testing-library/react";

import { generateBlogs } from "../../test/buildBlog";

import Main from "../Main";

beforeEach(() => {
  jest.spyOn(axios, "get").mockImplementation((...args) => {
    console.warn("axios.get is not mocked for this call", ...args);
    return Promise.reject(new Error("This must be mocked!"));
  });
});

afterEach(() => {
  const axiosGet = axios.get as jest.Mock;
  axiosGet.mockClear();
});

describe("<Main/>", () => {
  test("renders intial state", async () => {
    const axisGet = axios.get as jest.Mock;

    const blogs = generateBlogs(2);

    axisGet.mockResolvedValueOnce({
      data: blogs
    });

    const { queryByText } = render(<Main />);

    expect(queryByText(/loading/i)).toBeInTheDocument();

    await waitForDomChange();
    blogs.forEach(blog => {
      expect(queryByText(blog.title)).toBeInTheDocument();
    });
  });
});
