import * as React from "react";
import { CurrentUserResponse as CurrentUserState } from "../types/inteface";
import { useAuthState } from "./auth-context";
import axios, { AxiosResponse } from "axios";
import { Dispatch, ContextProps } from "../types/types";

type Action = { type: "SET_USER"; payload: CurrentUserState };

export const CurrentUserStateContext = React.createContext<CurrentUserState | null>(
  null
);
export const CurrentUserDispatchContext = React.createContext<Dispatch<
  Action
> | null>(null);

const currentUserReducer = (state: CurrentUserState, action: Action) => {
  switch (action.type) {
    case "SET_USER": {
      return {
        ...state,
        ...action.payload
      };
    }
    default: {
      throw new Error(`Action type is not found in user context`);
    }
  }
};

const INITIALSTATE: CurrentUserState = {
  userId: null,
  name: null,
  username: null,
  usersProfile: null,
  profile: null,
  blogs: []
};

export const CurrentUserProvider = ({
  children
}: ContextProps): JSX.Element => {
  const [state, dispatch] = React.useReducer(currentUserReducer, INITIALSTATE);
  const authState = useAuthState();

  React.useLayoutEffect(() => {
    if (authState.isAuthenticated) {
      axios
        .get("http://localhost:5000/profile/current", {
          headers: { authorization: authState.token }
        })
        .then((res: AxiosResponse<CurrentUserState>) => {
          dispatch({ type: "SET_USER", payload: res.data });
        });
    }
  }, [authState]);

  return (
    <CurrentUserStateContext.Provider value={state}>
      <CurrentUserDispatchContext.Provider value={dispatch}>
        {children}
      </CurrentUserDispatchContext.Provider>
    </CurrentUserStateContext.Provider>
  );
};

export function useCurrentUserState(): CurrentUserState {
  const Context = React.useContext(CurrentUserStateContext);

  if (!Context) {
    throw new Error(
      `useCurrentUserState must be used iniside CurreuntUser provider`
    );
  }

  return Context;
}

export function useCurrentUserDispatch(): Dispatch<Action> {
  const Context = React.useContext(CurrentUserDispatchContext);

  if (!Context) {
    throw new Error(
      `useCurrentUserDispatch must be used iniside CurreuntUser provider`
    );
  }

  return Context;
}

export const getProfile = (token: string, dispatch: Dispatch<Action>): void => {
  axios
    .get("http://localhost:5000/profile/current", {
      headers: { authorization: token }
    })
    .then((res: AxiosResponse<CurrentUserState>) => {
      dispatch({ type: "SET_USER", payload: res.data });
    });
};
