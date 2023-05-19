import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { get, getDatabase, ref, set } from "firebase/database";
import { NavigateFunction } from "react-router-dom";
import { app } from "../../firebase";
import { createAlert } from "./alert-slice";
import getErrorDetails from "../../utils/getErrorDetails";

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
  },
});

export default userSlice.reducer;

export const { setUserData } = userSlice.actions;

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
          dispatch(createAlert({alertTitle:"Success!",alertText:"Successfully created an account!",alertType:"success"}))          
          navigate("/library");
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        dispatch(createAlert(getErrorDetails(errorCode)))
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
          dispatch(createAlert({alertTitle:"Success!",alertText:"Successfully signed in!",alertType:"success"}))          


                navigate("/library")
              } else {
                dispatch(createAlert({alertTitle:"An error occurred!",alertText:"Incorrect user name",alertType:"error"}))

              }
            } else {
              dispatch(createAlert({alertTitle:"An error occurred!",alertText:"Unknown database error!",alertType:"error"}))

            }
          } else {
            dispatch(createAlert({alertTitle:"An error occurred!",alertText:"Unknown database error!",alertType:"error"}))
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        dispatch(createAlert(getErrorDetails(errorCode)))

      });
    return undefined;
  }
);

export const autoLogin = createAsyncThunk<undefined, undefined, {}>(
  "user/autoLogin",
  async (_, { dispatch }) => {
    console.log("qwe");
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        const fetchDATA = async () => {
          const db = getDatabase(app);
          const userRef = ref(db, `usersDATA/${user.uid}/userDATA`);
          await get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
              const userDATA = snapshot.val();
              dispatch(setUserData(userDATA));
            } else {
              dispatch(createAlert({alertTitle:"An error occurred!",alertText:"Unknown database error!",alertType:"error"}))

            }
          });
        };
        fetchDATA();
      }
    });
    return undefined;
  }
);
