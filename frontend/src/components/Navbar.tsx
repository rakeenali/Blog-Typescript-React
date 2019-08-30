import React from "react";
import styled from "styled-components";
import { Link } from "@reach/router";

import { Profile } from "../types/inteface";
import { Theme } from "../theme";

type Props = {
  isAuthenticated: boolean;
  profile?: Profile | null;
  logout?: () => void;
};

export default function Navbar({
  isAuthenticated,
  profile,
  logout
}: Props): JSX.Element {
  const renderHead = (): JSX.Element => {
    if (profile) {
      return (
        <>
          <img src={profile.avatar} alt={profile.firstName} />
          <h2>
            {profile.firstName} {profile.lastName}
          </h2>
        </>
      );
    }
    return <></>;
  };

  if (isAuthenticated) {
    return (
      <NavContainer>
        <AuthNav>
          <Header>{renderHead()}</Header>
          <AuthUl>
            <LI>
              <NavLink to="/">Home</NavLink>
            </LI>
            <LI>
              <NavLink to="/profile">Profile</NavLink>
            </LI>
            <LI>
              <NavLink to="/manage">Manage</NavLink>
            </LI>
            <LI>
              <NavLink to="/add">Add Blog</NavLink>
            </LI>
            <LI>
              <button onClick={logout}>Logout</button>
            </LI>
          </AuthUl>
          <Footer>
            <h3>
              Created By <strong>Rakeen Ali</strong>
            </h3>
            <a href="https://www.github.com/rakeenali">Github</a>
          </Footer>
        </AuthNav>
      </NavContainer>
    );
  }
  return (
    <NavContainer>
      <Nav>
        <Ul>
          <LI>
            <NavLink to="/login">Login</NavLink>
          </LI>
          <LI>
            <NavLink to="/register">Register</NavLink>
          </LI>
        </Ul>
      </Nav>
    </NavContainer>
  );
}

const NavContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${Theme.primaryColor};
  position: relative;
`;

const Nav = styled.nav`
  height: 100%;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
`;

const Ul = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const LI = styled.li`
  padding: 10px;
  text-align: center;
  margin-bottom: 10px;

  a,
  button {
    text-decoration: none;
    font-weight: bolder;
    font-size: 20px;

    &:hover {
      color: #63d1f4 !important;
    }
  }

  button {
    background-color: transparent;
    border: none;
    color: #f30728;
    cursor: pointer;
    &:hover {
      color: cyan !important;
    }
  }
`;

const AuthNav = styled.nav`
  height: 100%;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
`;

const AuthUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  flex-basis: 60%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Header = styled.header`
  flex-basis: 20%;
  height: 100%;
  width: 100%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    margin-right: 10px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-top: -10px;
  }
`;

const Footer = styled.footer`
  flex-basis: 20%;
  height: 100%;
  width: 100%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h3 {
    strong {
      color: #ccc;
      font-weight: bolder;
    }
  }
  a {
    font-weight: bolder;
    color: rgb(99, 209, 244);
  }
`;

const NavLink = (props: any) => {
  return (
    <Link
      {...props}
      getProps={({ isCurrent }) => {
        return {
          style: {
            color: isCurrent ? "#63d1f4" : "#ccc",
            textDecoration: isCurrent ? "underline" : "none"
          }
        };
      }}
    />
  );
};
