import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import { get, getDatabase, ref, set } from "firebase/database";
import { NavigateFunction } from "react-router-dom";
import { app } from "../../firebase";
import { createAlert } from "./alert-slice";
import getErrorDetails from "../../utils/getErrorDetails";
import { clearPending, setPending } from "./pending-slice";
import { RootState } from "..";

interface initialStateI {
  userName: string;
  password: string;
  userPhoto: string;
  email: string;
  userID: string;
}
const initialState: initialStateI = {
  userName: "",
  userPhoto: "",
  password: "",
  email: "",
  userID: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUserData(state, action) {
      state.email = action.payload.email;
      state.userName = action.payload.userName;
      state.userPhoto = action.payload.userPhoto;
      state.password = action.payload.password;
      state.userID = action.payload.userID;
    },
    removeUserData(state) {
      state.email = "";
      state.password = "";
      state.userID = "";
      state.userName = "";
      state.userPhoto = "";
    },
  },
  extraReducers(builder) {
    builder.addCase(changeUsername.fulfilled, (state, action) => {
      if (action.payload?.newUsername)
        state.userName = action.payload.newUsername;
    });
    builder.addCase(changeUserPassword.fulfilled, (state, action) => {
      if (action.payload?.newPassword)
        state.password = action.payload.newPassword;
    });
    builder.addCase(changeUserEmail.fulfilled, (state, action) => {
      if (action.payload?.newEmail) state.email = action.payload.newEmail;
    });
  },
});

export default userSlice.reducer;

export const { setUserData, removeUserData } = userSlice.actions;

export const createUser = createAsyncThunk<
  undefined,
  {
    userName: string;
    email: string;
    password: string;
    navigate: NavigateFunction;
  },
  {}
>(
  "user/createUser",
  async ({ userName, email, password, navigate }, { dispatch }) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const db = getDatabase();
        const dbRef = ref(db, `usersDATA/${user.uid}/userDATA`);
        const userDATA = {
          email: email,
          password: password,
          userName: userName,
          userID: user.uid,
          userPhoto: "",
        };
        set(dbRef, userDATA).then(() => {
          dispatch(setUserData(userDATA));
          dispatch(
            createAlert({
              alertTitle: "Success!",
              alertText: "Successfully created an account!",
              alertType: "success",
            })
          );
          navigate("/library");
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        dispatch(createAlert(getErrorDetails(errorCode)));
      });
    return undefined;
  }
);

export const signIn = createAsyncThunk<
  undefined,
  {
    email: string;
    password: string;
    userName: string;
    navigate: NavigateFunction;
  },
  {}
>(
  "user/signIn",
  async ({ email, password, userName, navigate }, { dispatch }) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user.uid);
        const db = getDatabase();
        const dbRef = ref(db, `usersDATA/${user.uid}/userDATA`);
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().userName) {
              if (snapshot.val().userName === userName) {
                const userName = snapshot.val().userName;
                const userPhoto = snapshot.val().userPhoto;
                const userDATA = {
                  email: email,
                  password: password,
                  userName: userName,
                  userID: user.uid,
                  userPhoto: userPhoto,
                };
                dispatch(setUserData(userDATA));
                dispatch(
                  createAlert({
                    alertTitle: "Success!",
                    alertText: "Successfully signed in!",
                    alertType: "success",
                  })
                );

                navigate("/library");
              } else {
                dispatch(
                  createAlert({
                    alertTitle: "An error occurred!",
                    alertText: "Incorrect user name",
                    alertType: "error",
                  })
                );
                auth.signOut();
                dispatch(removeUserData());
              }
            } else {
              dispatch(
                createAlert({
                  alertTitle: "An error occurred!",
                  alertText: "Unknown database error!",
                  alertType: "error",
                })
              );
            }
          } else {
            dispatch(
              createAlert({
                alertTitle: "An error occurred!",
                alertText: "Unknown database error!",
                alertType: "error",
              })
            );
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        dispatch(createAlert(getErrorDetails(errorCode)));
      });
    return undefined;
  }
);

export const autoLogin = createAsyncThunk<undefined, undefined, {}>(
  "user/autoLogin",
  async (_, { dispatch }) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user?.email);
      console.log(user?.providerData);
      if (user) {
        const fetchDATA = async () => {
          const db = getDatabase(app);
          const userRef = ref(db, `usersDATA/${user.uid}/userDATA`);
          await get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
              const userDATA = snapshot.val();
              console.log(userDATA);
              dispatch(setUserData(userDATA));
            } else {
              dispatch(
                createAlert({
                  alertTitle: "An error occurred!",
                  alertText: "Could not find your account data!",
                  alertType: "error",
                })
              );
              auth.signOut();
            }
          });
        };
        fetchDATA();
      }
    });
    return undefined;
  }
);

export const changeUserEmail = createAsyncThunk<
  { newEmail: string } | null,
  { newEmail: string },
  {}
>(
  "user/changeUserEmail",
  async function ({ newEmail }, { dispatch, getState }) {
    const auth = getAuth();
    const user = auth.currentUser;
    const appState = getState() as RootState;
    const currentEmail = appState.user.email;
    dispatch(setPending());
    if (currentEmail === newEmail) {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Entered email and your current are the same!",
          alertType: "error",
        })
      );
      dispatch(clearPending());
      return null;
    }
    if (user) {
      if (user?.email) {
        const credential = EmailAuthProvider.credential(
          user.email,
          appState.user.password
        );
        await reauthenticateWithCredential(user, credential)
          .then(() => {
            updateEmail(user, newEmail)
              .then(() => {
                const db = getDatabase();
                const dbRef = ref(
                  db,
                  `usersDATA/${appState.user.userID}/userDATA/email`
                );
                set(dbRef, newEmail).then(() => {
                  dispatch(
                    createAlert({
                      alertTitle: "Success!",
                      alertText: "Email successfully changed!",
                      alertType: "success",
                    })
                  );
                });
              })
              .catch(() => {
                dispatch(
                  createAlert({
                    alertTitle: "Database error!",
                    alertText: "Changing Email failed!",
                    alertType: "error",
                  })
                );
              });
          })
          .catch((e) => {
            console.log(e.code);
          });
      }
    } else {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Auth error!",
          alertType: "error",
        })
      );
    }
    dispatch(clearPending());
    return { newEmail };
  }
);

export const changeUserPassword = createAsyncThunk<
  { newPassword: string } | null,
  { newPassword: string },
  {}
>(
  "user/changeUserPassword",
  async function ({ newPassword }, { dispatch, getState }) {
    const appState = getState() as RootState;
    dispatch(setPending());

    const auth = getAuth();
    const user = auth.currentUser;

    const currentPassword = appState.user.password;

    if (currentPassword === newPassword) {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Entered password and your current are the same!",
          alertType: "error",
        })
      );
      dispatch(clearPending());

      return null;
    } else {
      if (user?.email) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential).then(() => {
          updatePassword(user, newPassword)
            .then(() => {
              const db = getDatabase();
              const dbRef = ref(
                db,
                `usersDATA/${appState.user.userID}/userDATA/password`
              );
              set(dbRef, newPassword);
            })
            .then(() => {
              dispatch(
                createAlert({
                  alertTitle: "Success!",
                  alertText: "Password successfully changed!",
                  alertType: "success",
                })
              );
            })
            .catch((e) => {
              console.log(e.message);
              dispatch(
                createAlert({
                  alertTitle: "Database error!",
                  alertText: "Changing Password failed!",
                  alertType: "error",
                })
              );
            });
        });
      } else {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "Auth error!",
            alertType: "error",
          })
        );
      }
    }

    dispatch(clearPending());
    return { newPassword };
  }
);

export const changeUsername = createAsyncThunk<
  { newUsername: string } | null,
  { newUsername: string },
  {}
>(
  "user/changeUsername",
  async function ({ newUsername }, { dispatch, getState }) {
    const appState = getState() as RootState;
    const userID = appState.user.userID;
    if (appState.user.userName === newUsername) {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Entered Username and your current are the same!",
          alertType: "error",
        })
      );
      return null;
    }
    const db = getDatabase();
    const dbRef = ref(db, `usersDATA/${userID}/userDATA/userName`);
    if (userID) {
      dispatch(setPending());
      set(dbRef, newUsername)
        .then(() => {
          dispatch(
            createAlert({
              alertTitle: "Success!",
              alertText: "Username successfully changed!",
              alertType: "success",
            })
          );
        })
        .catch(() => {
          dispatch(
            createAlert({
              alertTitle: "Database error!",
              alertText: "Changing Username failed!",
              alertType: "error",
            })
          );
        });
    }

    dispatch(clearPending());
    return { newUsername };
  }
);
