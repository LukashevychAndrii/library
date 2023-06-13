import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface initialStateI {
  scrolledALittle: boolean;
  scrollTop: boolean;
}
const initialState: initialStateI = {
  scrolledALittle: false,
  scrollTop: false,
};

const scrollSlice = createSlice({
  name: "scroll",
  initialState: initialState,
  reducers: {
    setScrolledALittle(state, action: PayloadAction<boolean>) {
      state.scrolledALittle = action.payload;
    },
    setScrollTop(state, action: PayloadAction<boolean>) {
      state.scrollTop = action.payload;
    },
  },
});

export default scrollSlice.reducer;
export const { setScrolledALittle, setScrollTop } = scrollSlice.actions;
