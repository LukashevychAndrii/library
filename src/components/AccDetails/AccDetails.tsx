import React from "react";
import styles from "./AccDetails.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Edit } from "../../img/SVG/write.svg";
import { ReactComponent as Copy } from "../../img/SVG/content_copy.svg";
import { ReactComponent as Eye } from "../../img/SVG/eye.svg";
import { ReactComponent as EyeSlash } from "../../img/SVG/eye-slash.svg";

import { getAuth, signOut } from "firebase/auth";
import { createAlert } from "../../store/slices/alert-slice";
import {
  changeUserEmail,
  changeUserPassword,
  changeUsername,
  removeUserData,
  userSignOut,
} from "../../store/slices/user-slice";
import { stringToAsterisc } from "../../utils/stringToAsterisc";

const AccDetails = () => {
  const [copied, SetCopied] = React.useState("end");
  const accDetails = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const userIDRef = React.useRef<HTMLDivElement>(null);
  const [changeName, setChangeName] = React.useState(false);
  const [newName, setNewName] = React.useState(accDetails.userName);
  const [changeEmail, setChangeEmail] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState(accDetails.email);
  const [changePassword, setChangePassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState(accDetails.password);

  const [showPassword, setShowPassword] = React.useState(false);

  const dispatch = useAppDispatch();

  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout>();
  React.useEffect(() => {
    if (!accDetails.userID) {
      navigate("/library");
    }
    console.log(accDetails);
  }, [accDetails, navigate]);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    console.log(copied);
    if (copied === "start" || copied === "restart") {
      timeout = setTimeout(() => {
        SetCopied("end");
      }, 7500);
      if (copied === "restart") {
        clearTimeout(timeout);
        SetCopied("start");
      }
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  function copyClickHandler() {
    if (userIDRef.current)
      navigator.clipboard.writeText(userIDRef.current.innerText);
    if (copied === "start") {
      SetCopied("restart");
    } else if (copied === "end") {
      SetCopied("start");
    }
  }

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div
      theme-acc-details__wrapper={theme}
      className={styles["acc-details__wrapper"]}
    >
      <div theme-acc-details={theme} className={styles["acc-details"]}>
        <div
          theme-acc-details__row={theme}
          className={styles["acc-details__row__wrapper"]}
        >
          <div>Name: </div>
          {changeName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(changeUsername({ newUsername: newName }));
                setChangeName(false);
              }}
            >
              <label htmlFor="new_name"></label>
              <input
                theme-acc-details__input={theme}
                className={styles["acc-details__input"]}
                value={newName}
                placeholder="Enter new name..."
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                id="new_name"
                name="new_name"
                type="text"
                autoFocus
              />
            </form>
          ) : (
            <div className={styles["acc-details__data"]}>
              {accDetails.userName}
            </div>
          )}
          {changeName ? (
            <div className={styles["acc-details__btns"]}>
              <span
                className={styles["acc-details__close-btn"]}
                onClick={() => {
                  setChangeName(false);
                }}
              >
                &times;
              </span>
              <span
                onClick={() => {
                  dispatch(changeUsername({ newUsername: newName }));
                  setChangeName(false);
                }}
                className={styles["acc-details__change-btn"]}
              >
                &#10003;
              </span>
            </div>
          ) : (
            <Edit
              className={styles["acc-details__edit-btn"]}
              onClick={() => {
                setChangeName(true);
                setNewName(accDetails.userName);
                setChangeEmail(false);
                setChangePassword(false);
              }}
            />
          )}
        </div>
        <div
          theme-acc-details__row={theme}
          className={styles["acc-details__row__wrapper"]}
        >
          <div>Email:</div>

          {changeEmail ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(changeUserEmail({ newEmail: newEmail }));
                setChangeEmail(false);
              }}
            >
              <label htmlFor="new_email"></label>
              <input
                theme-acc-details__input={theme}
                className={styles["acc-details__input"]}
                value={newEmail}
                placeholder="Enter new email..."
                onChange={(e) => {
                  setNewEmail(e.target.value);
                }}
                id="new_email"
                name="new_email"
                type="text"
                autoFocus
              />
            </form>
          ) : (
            <div className={styles["acc-details__data"]}>
              {accDetails.email}
            </div>
          )}
          {changeEmail ? (
            <div className={styles["acc-details__btns"]}>
              <span
                className={styles["acc-details__close-btn"]}
                onClick={() => {
                  setChangeEmail(false);
                }}
              >
                &times;
              </span>
              <span
                onClick={() => {
                  setChangeEmail(false);
                  dispatch(changeUserEmail({ newEmail: newEmail }));
                }}
                className={styles["acc-details__change-btn"]}
              >
                &#10003;
              </span>
            </div>
          ) : (
            <Edit
              className={styles["acc-details__edit-btn"]}
              onClick={() => {
                setChangeEmail(true);
                setNewEmail(accDetails.email);
                setChangeName(false);
                setChangePassword(false);
              }}
            />
          )}
        </div>
        <div
          theme-acc-details__row={theme}
          className={styles["acc-details__row__wrapper"]}
        >
          <div>Password: </div>
          {changePassword ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(changeUserPassword({ newPassword: newPassword }));
                setChangePassword(false);
              }}
              style={{ position: "relative" }}
            >
              <label htmlFor="new_password"></label>
              <input
                theme-acc-details__input={theme}
                className={styles["acc-details__input"]}
                value={
                  showPassword ? newPassword : stringToAsterisc(newPassword)
                }
                placeholder="Enter new password..."
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                id="new_password"
                name="new_password"
                type="text"
                autoFocus
              />
              {showPassword ? (
                <Eye
                  className={`${styles["acc-details__eye"]} ${styles["acc-details__edit-btn"]}`}
                  onClick={() => {
                    setShowPassword(false);
                  }}
                />
              ) : (
                <EyeSlash
                  className={`${styles["acc-details__eye"]} ${styles["acc-details__edit-btn"]}`}
                  onClick={() => {
                    setShowPassword(true);
                  }}
                />
              )}
            </form>
          ) : (
            <div className={styles["acc-details__data"]}>
              {stringToAsterisc(accDetails.password)}
            </div>
          )}
          {changePassword ? (
            <div className={styles["acc-details__btns"]}>
              <span
                className={styles["acc-details__close-btn"]}
                onClick={() => {
                  setChangePassword(false);
                  setNewPassword(accDetails.password);
                }}
              >
                &times;
              </span>
              <span
                onClick={() => {
                  dispatch(changeUserPassword({ newPassword: newPassword }));
                  setChangePassword(false);
                }}
                className={styles["acc-details__change-btn"]}
              >
                &#10003;
              </span>
            </div>
          ) : (
            <Edit
              className={styles["acc-details__edit-btn"]}
              onClick={() => {
                setChangePassword(true);
                setChangeName(false);
                setChangeEmail(false);
              }}
            />
          )}
        </div>
        <div
          theme-acc-details__row={theme}
          className={styles["acc-details__row__wrapper"]}
        >
          <div>ID: </div>
          <div className={styles["acc-details__id"]} ref={userIDRef}>
            {accDetails.userID}
          </div>
          <Copy
            className={styles["acc-details__copy-btn"]}
            style={{ width: "18px", height: "18px" }}
            onClick={() => {
              copyClickHandler();
            }}
          />
        </div>

        <button
          className={`btn ${theme === "dark" ? "btn--dark" : "btn--light"} ${
            styles["acc-details__btn"]
          }`}
          onClick={() => {
            dispatch(userSignOut());
          }}
        >
          Sign Out
        </button>
      </div>
      <div
        theme-copy-alert-window={theme}
        className={`${styles["acc-details__copy"]} ${
          copied === "start" && styles["acc-details__copy__animation"]
        }`}
      >
        Copied to clipboard
      </div>
    </div>
  );
};

export default AccDetails;
