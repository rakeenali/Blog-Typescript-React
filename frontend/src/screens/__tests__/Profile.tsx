import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { render } from "@testing-library/react";

import { getUser } from "../../test/buildUser";
import { generateBlogs } from "../../test/buildBlog";
import * as AuthContext from "../../context/auth-context";
import * as CurrentUserContext from "../../context/current-user-context";
import Profile from "../Profile";

describe("<Profile/>", () => {
  test("get profile correctly", () => {
    CurrentUserContext.getProfile = jest.fn();

    const { rerender, queryByText, container } = render(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserProvider>
          <Profile />
        </CurrentUserContext.CurrentUserProvider>
      </AuthContext.AuthProvider>
    );

    expect(queryByText("loading")).toBeInTheDocument();
    expect(CurrentUserContext.getProfile).toHaveBeenCalledTimes(1);

    const blogCount = 2;
    const blogs = generateBlogs(blogCount);
    const user = getUser({ blogs: blogs });

    rerender(
      <AuthContext.AuthProvider>
        <CurrentUserContext.CurrentUserStateContext.Provider value={user}>
          <CurrentUserContext.CurrentUserDispatchContext.Provider
            value={() => null}
          >
            <Profile />
          </CurrentUserContext.CurrentUserDispatchContext.Provider>
        </CurrentUserContext.CurrentUserStateContext.Provider>
      </AuthContext.AuthProvider>
    );

    const blogArea = container.querySelectorAll("section > div");

    blogs.forEach(blog => {
      expect(queryByText(blog.title)).toBeInTheDocument();
    });
    expect(blogArea.length).toEqual(blogCount);
  });
});
