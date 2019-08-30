import React from "react";
import styled from "styled-components";
import axios from "axios";

import { ErrorResponse, BlogResponse } from "../types/types";
import Error from "./Error";
import { Card, FormButton } from "../theme";

interface Props {
  title: string;
  description: string;
  blogId: number;
  token: string;
  onClose: () => void;
}

interface FormState {
  title: string;
  description: string;
}

const UpdateModal = (props: Props): JSX.Element => {
  const [text, setText] = React.useState<FormState>({
    title: "",
    description: ""
  });
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  React.useEffect(() => {
    setText({ title: props.title, description: props.description });
  }, [props]);

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const updateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:5000/blog/${props.blogId}`,
        {
          title: text.title,
          description: text.description
        },
        { headers: { authorization: props.token } }
      )
      .then((res: BlogResponse) => {
        if (res && res.data) {
          props.onClose();
        }
      })
      .catch((err: ErrorResponse) => {
        if (err && err.response) {
          setShowError(true);
          setErrorMessage(err.response.data.error);
        }
      });
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText({ ...text, [e.target.name]: e.target.value });
  };

  return (
    <>
      {showError && <Error message={errorMessage} closeError={closeError} />}
      <Modal>
        <Card height="480px" width="50%">
          <Inner>
            <Header>Update Your Blog</Header>
            <div>
              <Form onSubmit={updateBlog}>
                <FormControl>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Title"
                    name="title"
                    value={text.title}
                    required
                    onChange={onChange}
                  />
                </FormControl>
                <FormControl>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    placeholder="Description"
                    name="description"
                    rows={6}
                    value={text.description}
                    required
                    onChange={onChange}
                  />
                </FormControl>
                <FormControl>
                  <FormButton>Update</FormButton>
                </FormControl>
              </Form>
            </div>
          </Inner>
        </Card>
        <CloseButton onClick={props.onClose}>&times;</CloseButton>
      </Modal>
    </>
  );
};

const Modal = styled.div`
  &:before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.98);
    z-index: -10;
    transition: all 0.2 ease-in;
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
  z-index: 100;
  transition: all 0.6 ease-in 0.3s;
`;

const Inner = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const Header = styled.h1`
  flex-basis: 20%;
  font-size: 40px;
`;
const Form = styled.form`
  flex-basis: 80%;
  height: 100%;
  width: 100%;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;

  label {
    font-size: 20px;
    margin-bottom: 10px;
    text-align: center;
  }

  input,
  textarea {
    outline-color: red;
    padding: 10px;
    width: 45vw;
    background-color: #ccc;
    border-radius: 8px;
    border: none;
    font-size: 17px;
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

export default UpdateModal;
