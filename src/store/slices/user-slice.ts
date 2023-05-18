import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { get, getDatabase, ref, set } from "firebase/database";
import { NavigateFunction } from "react-router-dom";

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

          navigate("/library");
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);
        // ..
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
  "user/createUser",
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
              } else {
                console.log("incorrect user name");
              }
            } else {
              console.log("no data 2");
            }
          } else {
            console.log("no data");
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    return undefined;
  }
);
