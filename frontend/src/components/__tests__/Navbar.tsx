import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { render, fireEvent } from "@testing-library/react";

import { getProfile } from "../../test/buildUser";
import Navbar from "../Navbar";

describe("<Navbar/>", () => {
  test("renders unauthenticated state correctly", () => {
    const navbarProps = {
      isAuthenticated: false
    };
    const { queryByText } = render(<Navbar {...navbarProps} />);

    expect(queryByText(/register/i)).toBeInTheDocument();
    expect(queryByText(/login/i)).toBeInTheDocument();
  });

  test("render the authenticated state correctly", () => {
    const profile = getProfile();
    const navbarProps = {
      isAuthenticated: true,
      profile,
      logout: jest.fn()
    };

    const { queryByText, container } = render(<Navbar {...navbarProps} />);

    const image = container.querySelector("header > img") as HTMLImageElement;
    const fullName = container.querySelector(
      "header > h2"
    ) as HTMLHeadingElement;

    expect(image.src).toEqual(profile.avatar);
    expect(fullName.textContent).toEqual(
      `${profile.firstName} ${profile.lastName}`
    );

    expect(queryByText("Manage")).toBeInTheDocument();
    expect(queryByText("Profile")).toBeInTheDocument();
    expect(queryByText("Add Blog")).toBeInTheDocument();

    const logoutButton = queryByText("Logout");
    logoutButton && fireEvent.click(logoutButton);
    expect(navbarProps.logout).toHaveBeenCalledTimes(1);
  });
});
