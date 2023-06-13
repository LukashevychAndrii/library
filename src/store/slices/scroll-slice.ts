import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface initialStateI {
  scrolledALittle: boolean;
}
const initialState: initialStateI = {
  scrolledALittle: false,
};

const scrollSlice = createSlice({
  name: "nav",
  initialState: initialState,
  reducers: {
    setScrolledALittle(state, action: PayloadAction<boolean>) {
      state.scrolledALittle = action.payload;
    },
  },
});

export default scrollSlice.reducer;
export const { setScrolledALittle } = scrollSlice.actions;
