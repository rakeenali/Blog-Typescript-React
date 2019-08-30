import React from "react";
import styled, { createGlobalStyle } from "styled-components";

import { Profile } from "../types/inteface";
import Navbar from "./Navbar";

import { Theme } from "../theme";

type Props = {
  children: React.ReactNode;
  isAuthenticated: boolean;
  profile?: null | Profile;
  logout?: () => void;
};

function Layout({ children, isAuthenticated, profile, logout }: Props) {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Navbar
          isAuthenticated={isAuthenticated}
          profile={profile}
          logout={logout}
        />
        <Main>{children}</Main>
      </Container>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
     * {
        box-sizing: border-box;
        margin: 0;
        overflow: hidden;

      }
  
    html,body {
        margin: 0;
        font-family: Roboto, Arial;
        font-size: 18px;
        line-height: 1.4;
        position: relative;
        min-height: 100vh;
        overflow: hidden;


        >div {
            margin-top: 0;
        }
    }

    h1,h2,h3,h4,h5,h6{
        line-height: 1.1;

        + * {
            margin-top: 0.5rem
        }
    }
    li {
        margin-top: 0.25rem;
    }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 3fr;
`;

const Main = styled.main`
  min-width: 100%;
  width: auto;
  height: 100%;
  background-color: ${Theme.secondaryColor};
  overflow-y: visible;
`;

export default Layout;
