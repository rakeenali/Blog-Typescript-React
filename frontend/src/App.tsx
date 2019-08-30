import React from "react";

import {
  useAuthState,
  getUserAction,
  useAuthDispatch
} from "./context/auth-context";
import { CurrentUserProvider } from "./context/current-user-context";

import AuthenticatedApp from "./state/AuthenticatedApp";
import UnAuthenticatedApp from "./state/UnAuthenticatedApp";

export default function App(): JSX.Element {
  const user = useAuthState();
  const dispatch = useAuthDispatch();
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useLayoutEffect(() => {
    if (!user.isAuthenticated) {
      setLoading(true);
      getUserAction(dispatch);
      setLoading(false);
    }
  }, [user.isAuthenticated, dispatch]);

  if (loading) {
    return <></>;
  }

  if (user.isAuthenticated) {
    return (
      <CurrentUserProvider>
        <AuthenticatedApp />
      </CurrentUserProvider>
    );
  }

  if (!user.isAuthenticated) {
    return <UnAuthenticatedApp />;
  }
  return <></>;
}
