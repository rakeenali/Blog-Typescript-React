import React, { FunctionComponent } from "react";
import { Router, RouteComponentProps, Redirect } from "@reach/router";

import Layout from "../components/Layout";
import Login from "../screens/Login";
import Register from "../screens/Register";

const UnAuthenticatedApp = (): JSX.Element => {
  return (
    <Layout isAuthenticated={false}>
      <Router>
        <Route path="/" component={RedirectLogin} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Router>
    </Layout>
  );
};

const RedirectLogin = (): JSX.Element => {
  return <Redirect to="/login" />;
};

type Props = { component: FunctionComponent } & RouteComponentProps;

const Route: FunctionComponent<Props> = ({ component: Component, ...rest }) => (
  <Component {...rest} />
);

export default UnAuthenticatedApp;
