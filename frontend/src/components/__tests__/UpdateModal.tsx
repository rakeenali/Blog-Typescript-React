import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { render, fireEvent, waitForDomChange } from "@testing-library/react";
import axios from "axios";

import UpdateModal from "../UpdateModal";

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

const props = {
  title: "Title",
  description: "Some description",
  blogId: 1,
  token: "jwt-token",
  onClose: jest.fn()
};

describe("<UpdateModal>", () => {
  test("shows the form correctly", () => {
    const { getByPlaceholderText } = render(<UpdateModal {...props} />);

    const title = getByPlaceholderText("Title") as HTMLInputElement;
    const description = getByPlaceholderText(
      "Description"
    ) as HTMLTextAreaElement;

    expect(title.value).toEqual(props.title);
    expect(description.textContent).toEqual(props.description);
  });

  test("can close the modal correctly", () => {
    const { getByPlaceholderText, queryByText } = render(
      <UpdateModal {...props} />
    );

    const title = getByPlaceholderText("Title") as HTMLInputElement;
    const description = getByPlaceholderText(
      "Description"
    ) as HTMLTextAreaElement;

    expect(title.value).toEqual(props.title);
    expect(description.textContent).toEqual(props.description);

    const closeButton = queryByText("×");
    closeButton && fireEvent.click(closeButton);

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  test("can update the blog correctly", () => {
    const axiosPost = axios.post as jest.Mock;

    const { getByPlaceholderText, queryByText, debug } = render(
      <UpdateModal {...props} />
    );

    const title = getByPlaceholderText("Title") as HTMLInputElement;
    const description = getByPlaceholderText(
      "Description"
    ) as HTMLTextAreaElement;

    expect(title.value).toEqual(props.title);
    expect(description.textContent).toEqual(props.description);

    axiosPost.mockResolvedValueOnce({
      data: {
        message: "Blog updated"
      }
    });

    const updateButton = queryByText("Update");
    updateButton && fireEvent.click(updateButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  test("can render error correctly", async () => {
    const axiosPost = axios.post as jest.Mock;

    const { getByPlaceholderText, queryByText, debug } = render(
      <UpdateModal {...props} />
    );

    const title = getByPlaceholderText("Title") as HTMLInputElement;
    const description = getByPlaceholderText(
      "Description"
    ) as HTMLTextAreaElement;

    fireEvent.change(title, { target: { value: "" } });

    const errorMessage = "Title field is required";
    axiosPost.mockRejectedValueOnce({
      response: {
        data: {
          error: errorMessage
        }
      }
    });

    const updateButton = queryByText("Update");
    updateButton && fireEvent.click(updateButton);

    await waitForDomChange();
    expect(queryByText(errorMessage)).toBeInTheDocument();
  });
});
