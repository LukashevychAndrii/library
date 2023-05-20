import { createSlice } from "@reduxjs/toolkit";

interface initialStateI {
  theme: string;
}
const initialState: initialStateI = {
  theme: "dark",
};
const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    toggleTheme(state) {
      if (state.theme === "dark") {
        state.theme = "light";
        return;
      } else if (state.theme === "light") {
        state.theme = "dark";
        return;
      }
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export default themeSlice.reducer;
export const { toggleTheme, setTheme } = themeSlice.actions;
