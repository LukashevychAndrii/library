import React from "react";
import Form from "./Form";
import { useAppDispatch } from "../../hooks/redux";
import { signIn } from "../../store/slices/user-slice";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleClick = (password: string, userName: string, email: string) => {
    dispatch(
      signIn({
        password: password,
        email: email,
        userName: userName,
        navigate: navigate,
      })
    );
  };
  return <Form title="sign in" handleClick={handleClick} />;
};

export default SignIn;
