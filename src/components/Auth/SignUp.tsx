import React from "react";
import Form from "./Form";
import { useAppDispatch } from "../../hooks/redux";
import { createUser } from "../../store/slices/user-slice";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleClick = async (
    password: string,
    userName: string,
    email: string
  ) => {
    dispatch(
      createUser({
        password: password,
        userName: userName,
        email: email,
        navigate: navigate,
      })
    );
  };
  return <Form title="sign up" handleClick={handleClick} />;
};

export default SignUp;
