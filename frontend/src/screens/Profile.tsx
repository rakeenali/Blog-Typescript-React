import React from "react";
import Blogs from "../components/Blogs";

import {
  useCurrentUserState,
  useCurrentUserDispatch,
  getProfile
} from "../context/current-user-context";
import { useAuthState } from "../context/auth-context";

const Profile = (): JSX.Element => {
  const userState = useCurrentUserState();
  const userDispatch = useCurrentUserDispatch();
  const authState = useAuthState();

  React.useLayoutEffect(() => {
    getProfile(authState.token, userDispatch);
  }, [authState.token, userDispatch]);

  if (userState.username) {
    return (
      <>
        <Blogs blogs={userState.blogs} username={userState.username} />
      </>
    );
  }

  return <></>;
};

export default Profile;
