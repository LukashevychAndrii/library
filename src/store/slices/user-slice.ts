import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
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
        // Signed in
        const user = userCredential.user;
        const userID = user.uid;
        const db = getDatabase();
        const dbRef = ref(db, `usersDATA/${userID}`);
        const userDATA = {
          email: email,
          password: password,
          userName: userName,
          userID: userID,
          userPhoto: "",
        };
        set(dbRef, userDATA).then(() => {
          dispatch(setUserData({ userDATA }));

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
