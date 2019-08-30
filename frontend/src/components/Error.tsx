import React from "react";
import styled from "styled-components";

interface IProps {
  message: string;
  closeError: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Error = (props: IProps) => {
  return (
    <Container>
      <CloseButton onClick={props.closeError}>&times;</CloseButton>
      <h2>{props.message}</h2>
    </Container>
  );
};

const Container = styled.div`
  &:before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.98);
    z-index: 100;
  }

  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;

  h2 {
    color: red;
    background-color: #ff00003b;
    padding: 5px;
    width: 95%;
    margin: 0 auto;
    border-radius: 4px;
    text-align: center;
    font-size: 50px;
    z-index: 600;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 5px;
  z-index: 100;
  font-size: 80px;
  border: none;
  color: red;
  background: none;
  cursor: pointer;

  &:hover {
    color: #ff0000bd;
  }
`;

export default Error;
