import React from "react";
import { NavLink } from "react-router-dom";
import { getStyle } from "../../MainHeader";

const Acc = () => {
  return (
    <>
      <NavLink className={getStyle} to="/library/sign-in">
        Sign In
      </NavLink>
      <NavLink className={getStyle} to="/library/sign-up">
        Sign Up
      </NavLink>
    </>
  );
};

export default Acc;
