import * as React from "react";
import { navigate } from "@reach/router";

import { Dispatch, ContextProps } from "../types/types";

export interface IAuthState {
  isAuthenticated: boolean;
  token: string;
}

type Action = { type: "LOGOUT" } | { type: "LOGIN"; payload: string };

export const AuthStateContext = React.createContext<IAuthState | null>(null);
export const AuthDispatchContext = React.createContext<Dispatch<Action> | null>(
  null
);

const authReducer = (state: IAuthState, action: Action) => {
  switch (action.type) {
    case "LOGIN": {
      return { ...state, isAuthenticated: true, token: action.payload };
    }
    case "LOGOUT": {
      return { ...INITIALSTATE };
    }
    default: {
      throw new Error(`Action type is not found in user context`);
    }
  }
};

const INITIALSTATE: IAuthState = {
  isAuthenticated: false,
  token: ""
};

export const AuthProvider = ({ children }: ContextProps): JSX.Element => {
  const [state, dispatch] = React.useReducer(authReducer, INITIALSTATE);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export function useAuthState(): IAuthState {
  const Context = React.useContext(AuthStateContext);

  if (!Context) {
    throw new Error(`useAuthState must be used iniside auth provider`);
  }

  return Context;
}

export function useAuthDispatch(): Dispatch<Action> {
  const Context = React.useContext(AuthDispatchContext);

  if (!Context) {
    throw new Error(`useAuthDispatch must be used iniside auth provider`);
  }

  return Context;
}

export const setUserAction = (
  token: string,
  dispatch: Dispatch<Action>
): void => {
  navigate("/profile");
  localStorage.setItem("blog:key", JSON.stringify(token));
  dispatch({ type: "LOGIN", payload: token });
};

export const getUserAction = (dispatch: Dispatch<Action>): void => {
  const rawToken = localStorage.getItem("blog:key");
  if (rawToken) {
    const token: string = JSON.parse(rawToken);
    dispatch({ type: "LOGIN", payload: token });
  }
};

export const logout = (dispatch: Dispatch<Action>): void => {
  localStorage.removeItem("blog:key");
  navigate("/login");
  dispatch({ type: "LOGOUT" });
};
