import styled from "styled-components";

export const Theme = {
  primaryColor: "#20242b",
  secondaryColor: "#8c8a8a",
  textColor: "#fff"
};

interface ICard {
  height: string;
  width: string;
  backgroundColor?: string;
}

export const Card = styled.div<ICard>`
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: ${props => props.backgroundColor || Theme.primaryColor};
  color: #fff;
  box-shadow: 2px 28px 44px #0401032e;
  border-radius: 10px;
`;

export const FormButton = styled.button`
  outline-color: red;
  width: 10vw;
  height: 50px;
  background-color: ${Theme.secondaryColor};
  color: black;
  font-size: 20px;
  box-shadow: 2px 28px 44px #0401032e;
  border-radius: 10px;
  margin: auto;
  border: none;
  transition: all 0.2s ease-out;

  &:hover {
    background-color: #eee;
  }
`;
