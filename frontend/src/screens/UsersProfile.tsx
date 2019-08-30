import React from "react";
import axios, { AxiosResponse } from "axios";
import { navigate } from "@reach/router";
import { useAuthState } from "../context/auth-context";

import Blogs from "../components/Blogs";
import { ErrorResponse } from "../types/types";
import { CurrentUserResponse } from "../types/inteface";

interface Props {
  username?: string;
}

const UsersProfile = (props: Props): JSX.Element => {
  const authState = useAuthState();
  const [
    currentUser,
    setCurrentUser
  ] = React.useState<CurrentUserResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/profile/${props.username}`, {
        headers: { authorization: authState.token }
      })
      .then((res: AxiosResponse<CurrentUserResponse>) => {
        if (res && res.data) {
          setCurrentUser(res.data);
          setLoading(false);
        }
      })
      .catch((err: ErrorResponse) => {
        if (err && err.response) {
          setLoading(false);
          navigate("/profile");
        }
      });
  }, [props.username, authState.token]);

  if (loading) {
    return (
      <div>
        <h3>loading</h3>
      </div>
    );
  }

  if (currentUser && currentUser.username) {
    return (
      <>
        <Blogs blogs={currentUser.blogs} username={currentUser.username} />
      </>
    );
  }

  return <></>;
};

export default UsersProfile;
