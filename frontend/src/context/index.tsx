import React from "react";

import { AuthProvider } from "./auth-context";

type AppProps = { children: React.ReactNode };

export default function AppProvider({ children }: AppProps): JSX.Element {
  return <AuthProvider>{children}</AuthProvider>;
}
