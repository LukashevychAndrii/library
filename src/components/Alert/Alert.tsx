import React from "react";
import styles from "./Alert.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { clearAlert } from "../../store/slices/alert-slice";

import ErrorAuthIcon from "../../img/PNG/user_error.png";
import ErrorAuthHardIcon from "../../img/PNG/user_error_hard.png";
import SuccessIcon from "../../img/PNG/user_success.png";
import SignOutIcon from "../../img/PNG/user_sign_out.png";
import ErrorDatabase from "../../img/PNG/database_error.png";

const Alert = () => {
  const alertData = useAppSelector((state) => state.alert);
  const dispatch = useAppDispatch();
  const [alertIcon, setAlertIcon] = React.useState<string>("");
  React.useEffect(() => {
    console.log(alertData.alertType);
    switch (alertData.alertType) {
      case "error":
        setAlertIcon(ErrorDatabase);
        break;
      case "error-auth":
        setAlertIcon(ErrorAuthIcon);
        break;
      case "error-auth-hard":
        setAlertIcon(ErrorAuthHardIcon);
        break;
      case "success":
        setAlertIcon(SuccessIcon);
        break;
      case "success-sign-out":
        setAlertIcon(SignOutIcon);
        break;
      default:
        setAlertIcon(ErrorDatabase);
        break;
    }
  }, [alertData]);

  React.useEffect(() => {
    if (
      alertData.alertText.length > 0 &&
      alertData.alertTitle.length > 0 &&
      alertData.alertType.length > 0
    ) {
      setTimeout(() => {
        dispatch(clearAlert());
      }, 5000);
    }
  }, [alertData, dispatch]);

  return (
    <div
      className={`${styles["alert-window"]} ${
        styles[`alert-window--${alertData.alertType}`]
      }`}
    >
      <div
        className={`${styles["alert-window__content"]} ${
          styles[`alert-window__content--${alertData.alertType}`]
        }`}
      >
        <img
          className={styles["alert-window__alert-icon"]}
          src={alertIcon}
          alt="error"
        />
        <div className={styles["alert-window__content__wrapper"]}>
          <div className={styles["alert-window__content--title"]}>
            {alertData.alertTitle}
          </div>
          <div className={styles["alert-window__content--text"]}>
            {alertData.alertText}
          </div>
        </div>
        <span
          onClick={() => {
            dispatch(clearAlert());
          }}
          className={styles["alert-window__content--close-btn"]}
        >
          &times;
        </span>
      </div>
    </div>
  );
};

export default Alert;
