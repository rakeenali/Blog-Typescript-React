import React, { FunctionComponent } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import { useCurrentUserState } from "../context/current-user-context";
import { logout as LOGOUT, useAuthDispatch } from "../context/auth-context";

import Blog from "../screens/Blog";
import Layout from "../components/Layout";
import Profile from "../screens/Profile";
import Manage from "../screens/Manage";
import AddBlog from "../screens/AddBlog";
import UsersProfile from "../screens/UsersProfile";
import Main from "../screens/Main";

export default function AuthenticatedApp(): JSX.Element {
  const userState = useCurrentUserState();
  const authDispatch = useAuthDispatch();

  return (
    <Layout
      isAuthenticated={true}
      profile={userState.profile}
      logout={() => LOGOUT(authDispatch)}
    >
      <Router>
        <Route path="/" component={Main} />
        <Route path="/profile" component={Profile} />
        <Route path="/manage" component={Manage} />
        <Route path="/add" component={AddBlog} />
        <SingleBlogRoute path="/blog/:id" component={Blog} />
        <UserProfileRoute path="/profile/:username" component={UsersProfile} />
      </Router>
    </Layout>
  );
}

type Props = { component: FunctionComponent } & RouteComponentProps;

const Route: FunctionComponent<Props> = ({ component: Component, ...rest }) => (
  <Component {...rest} />
);

type ComponentWithId = FunctionComponent<{ id?: string }>;

type PropsWithId = {
  component: ComponentWithId;
  id?: string;
} & RouteComponentProps;

const SingleBlogRoute: FunctionComponent<PropsWithId> = ({
  component: Component,
  id,
  ...rest
}) => <Component id={id} {...rest} />;

type ComponentWithUsername = FunctionComponent<{ username?: string }>;

type PropsWithUsername = {
  component: ComponentWithUsername;
  username?: string;
} & RouteComponentProps;

const UserProfileRoute: FunctionComponent<PropsWithUsername> = ({
  component: Component,
  username,
  ...rest
}) => <Component username={username} {...rest} />;
