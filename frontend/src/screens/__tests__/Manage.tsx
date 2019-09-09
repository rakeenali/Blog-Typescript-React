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

import { getUser, getProfile } from "../../test/buildUser";
import * as AuthContext from "../../context/auth-context";
import * as CurrentUserContext from "../../context/current-user-context";
import Manage from "../Manage";

jest.mock("@reach/router", () => {
  const navigate = jest.fn();
  return { navigate };
});

beforeEach(() => {
  jest.spyOn(axios, "post").mockImplementation((...args) => {
    console.warn("axios.post is not mocked for this call", ...args);
    return Promise.reject(new Error("This must be mocked!"));
  });
});

afterEach(() => {
  const postAxios = axios.post as jest.Mock;
  const navigateMock = navigate as jest.Mock;
  postAxios.mockClear();
  navigateMock.mockClear();
});

describe("<Manage/>", () => {
  test("renders the form correctly", async () => {
    const { container } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserProvider>
          <Manage />
        </CurrentUserContext.CurrentUserProvider>
      </AuthContext.AuthProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("handle form changes correctly", () => {
    const firstNameText = "Rakeen";
    const lastNameText = "Ali";
    const avatarUrl =
      "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

    const { getByPlaceholderText } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserProvider>
          <Manage />
        </CurrentUserContext.CurrentUserProvider>
      </AuthContext.AuthProvider>
    );

    const firstName = getByPlaceholderText("First Name") as HTMLInputElement;
    const lastName = getByPlaceholderText("Last Name") as HTMLInputElement;
    const avatarLink = getByPlaceholderText(
      "Avatar's Link"
    ) as HTMLInputElement;

    fireEvent.change(firstName, { target: { value: firstNameText } });
    fireEvent.change(lastName, { target: { value: lastNameText } });
    fireEvent.change(avatarLink, { target: { value: avatarUrl } });

    expect(firstName.value).toEqual(firstNameText);
    expect(lastName.value).toEqual(lastNameText);
    expect(avatarLink.value).toEqual(avatarUrl);
  });

  test("can add profile", async () => {
    CurrentUserContext.getProfile = jest.fn();
    const axiosPost = axios.post as jest.Mock;

    const firstNameText = "Rakeen";
    const lastNameText = "Ali";
    const avatarUrl =
      "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

    const { getByPlaceholderText, queryByText } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserProvider>
          <Manage />
        </CurrentUserContext.CurrentUserProvider>
      </AuthContext.AuthProvider>
    );

    const firstName = getByPlaceholderText("First Name") as HTMLInputElement;
    const lastName = getByPlaceholderText("Last Name") as HTMLInputElement;
    const avatarLink = getByPlaceholderText(
      "Avatar's Link"
    ) as HTMLInputElement;

    fireEvent.change(firstName, { target: { value: firstNameText } });
    fireEvent.change(lastName, { target: { value: lastNameText } });
    fireEvent.change(avatarLink, { target: { value: avatarUrl } });

    expect(firstName.value).toEqual(firstNameText);
    expect(lastName.value).toEqual(lastNameText);
    expect(avatarLink.value).toEqual(avatarUrl);

    axiosPost.mockResolvedValueOnce({
      data: {
        message: "Profile updated"
      }
    });

    const proceedButton = queryByText("Proceed");
    proceedButton && fireEvent.click(proceedButton);

    await wait(
      () => {
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(CurrentUserContext.getProfile).toHaveBeenCalledTimes(1);
      },
      { timeout: 100 }
    );
  });

  test("can update profile", async () => {
    CurrentUserContext.getProfile = jest.fn();
    const axiosPost = axios.post as jest.Mock;

    const profile = getProfile();
    const user = getUser({ profile });

    const { getByPlaceholderText, queryByText } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserStateContext.Provider value={user}>
          <CurrentUserContext.CurrentUserDispatchContext.Provider
            value={() => null}
          >
            <Manage />
          </CurrentUserContext.CurrentUserDispatchContext.Provider>
        </CurrentUserContext.CurrentUserStateContext.Provider>
      </AuthContext.AuthProvider>
    );

    const firstName = getByPlaceholderText("First Name") as HTMLInputElement;
    const lastName = getByPlaceholderText("Last Name") as HTMLInputElement;
    const avatarLink = getByPlaceholderText(
      "Avatar's Link"
    ) as HTMLInputElement;

    expect(firstName.value).toEqual(profile.firstName);
    expect(lastName.value).toEqual(profile.lastName);
    expect(avatarLink.value).toEqual(profile.avatar);

    fireEvent.change(firstName, { target: { value: "Rakeen" } });
    expect(firstName.value).toEqual("Rakeen");

    axiosPost.mockResolvedValueOnce({
      data: {
        message: "Profile updated"
      }
    });

    const proceedButton = queryByText("Proceed");

    proceedButton && fireEvent.click(proceedButton);

    await wait(
      () => {
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(CurrentUserContext.getProfile).toHaveBeenCalledTimes(1);
      },
      { timeout: 100 }
    );
  });

  test("can render error correctly", async () => {
    const axiosPost = axios.post as jest.Mock;

    const firstNameText = "Rakeen";
    const avatarUrl =
      "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

    const { getByPlaceholderText, debug, queryByText } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserProvider>
          <Manage />
        </CurrentUserContext.CurrentUserProvider>
      </AuthContext.AuthProvider>
    );

    const firstName = getByPlaceholderText("First Name") as HTMLInputElement;
    const avatarLink = getByPlaceholderText(
      "Avatar's Link"
    ) as HTMLInputElement;

    fireEvent.change(firstName, { target: { value: firstNameText } });
    fireEvent.change(avatarLink, { target: { value: avatarUrl } });

    const proceedButton = queryByText("Proceed");
    const errorMessage = "Last Name field is required";

    axiosPost.mockRejectedValueOnce({
      response: {
        data: {
          error: errorMessage
        }
      }
    });

    proceedButton && fireEvent.click(proceedButton);

    await waitForDomChange();

    expect(queryByText(errorMessage)).toBeInTheDocument();
  });
});
