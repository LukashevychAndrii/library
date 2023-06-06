import React, { FormEvent, useState } from "react";
import styles from "./Form.module.scss";
import { NavLink } from "react-router-dom";

import { ReactComponent as EyeSlash } from "../../img/SVG/eye-slash.svg";
import { ReactComponent as Eye } from "../../img/SVG/eye.svg";
import { useAppSelector } from "../../hooks/redux";

interface props {
  title: string;

  handleClick: (email: string, pass: string, userName: string) => void;
}

const Form = ({ title, handleClick }: props) => {
  const [showPass, setShowPass] = React.useState<boolean>(false);

  const [userName, setUserName] = useState("");
  const [userNameTouched, setUserNameTouched] = useState<boolean>(false);
  const [userNameError, setUserNameError] = useState<string>(
    "Please, enter a valid User Name!"
  );

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>(
    "Please, enter a valid email!"
  );
  const [pass, setPass] = useState("");
  const [passTouched, setPassTouched] = useState<boolean>(false);
  const [passError, setPassError] = useState<string>(
    "Please, enter a valid password!"
  );

  const [formValid, setFormValid] = useState<boolean>(false);

  function eyeClickHandler() {
    setShowPass(!showPass);
  }
  React.useEffect(() => {
    if (emailError || passError || userNameError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [emailError, passError, userNameError]);

  function userNameChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.trim().length < 4) {
      setUserNameError("Min length of userName is 4");
    } else if (e.target.value.trim().length > 10) {
      setUserNameError("Max length of userName is 10");
      return;
    } else {
      setUserNameError("");
    }
    setUserName(e.target.value);
  }
  function emailChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(e.target.value)) {
      setEmailError("Please enter a valid  email!");
    } else if (e.target.value.trim().length > 30) {
      setEmailError("Please enter a valid  email!");
    } else {
      setEmailError("");
    }
  }
  function passChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.trim().length < 6) {
      setPassError("Min length of password is 6");
    } else if (e.target.value.trim().length > 20) {
      setPassError("Max length of password is 20");
      return;
    } else {
      setPassError("");
    }
    setPass(e.target.value);
  }

  function emailBlurHandler(e: React.FocusEvent<HTMLInputElement, Element>) {
    const target = e.target as HTMLInputElement;
    switch (target.name) {
      case "email":
        setEmailTouched(true);
        break;
      case "pass":
        setPassTouched(true);
        break;
      case "userName":
        setUserNameTouched(true);
        break;
    }
  }
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div theme-form={theme} className={styles["form__wrapper"]}>
      <form
        className={styles["form"]}
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
        }}
      >
        <div theme-form-links={theme} className={styles["form__links"]}>
          <NavLink
            className={({ isActive }) =>
              isActive ? styles["active"] : styles["inactive"]
            }
            to="/library/sign-in"
          >
            Sign in
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? styles["active"] : styles["inactive"]
            }
            to="/library/sign-up"
          >
            Sign up
          </NavLink>
        </div>

        <div className={styles["form__element"]}>
          {userNameTouched && userNameError && (
            <p className={styles["form__error"]}>{userNameError}</p>
          )}
          <label htmlFor="userName"></label>
          <input
            theme-form-input={theme}
            type="userName"
            id="userName"
            name="userName"
            value={userName}
            placeholder="User name"
            required
            onChange={userNameChangeHandler}
            onBlur={emailBlurHandler}
          />
        </div>
        <div className={styles["form__element"]}>
          {emailTouched && emailError && (
            <p className={styles["form__error"]}>{emailError}</p>
          )}
          <label htmlFor="email"></label>
          <input
            theme-form-input={theme}
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Email"
            required
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
        </div>
        <div className={styles["form__element"]}>
          {passTouched && passError && (
            <p className={styles["form__error"]}>{passError}</p>
          )}
          <div className={styles["form__element__wrapper"]}>
            <label htmlFor="pass"></label>
            <input
              theme-form-input={theme}
              type={showPass ? "text" : "password"}
              id="pass"
              name="pass"
              value={pass}
              required
              placeholder="Password"
              onChange={passChangeHandler}
              onBlur={emailBlurHandler}
            />

            <EyeSlash
              onClick={eyeClickHandler}
              style={{ display: showPass ? "none" : "block" }}
              className={styles["form__eye-slash"]}
            />
            <Eye
              onClick={eyeClickHandler}
              style={{ display: showPass ? "block" : "none" }}
              className={styles["form__eye"]}
            />
          </div>
        </div>

        <button
          theme-form-sign-in={theme}
          disabled={!formValid}
          className={`${styles["form__element"]} ${styles["form__btn"]}`}
          onClick={() => {
            handleClick(pass, userName, email);
          }}
        >
          {title}
        </button>
      </form>
    </div>
  );
};

export default Form;
