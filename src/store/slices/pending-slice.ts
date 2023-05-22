import { createSlice } from "@reduxjs/toolkit";

interface initialStateI {
  pending: boolean;
}
const initialState: initialStateI = {
  pending: false,
};
const pendingSlice = createSlice({
  name: "pending",
  initialState: initialState,
  reducers: {
    setPending(state) {
      state.pending = true;
    },
    clearPending(state) {
      state.pending = false;
    },
  },
});

export default pendingSlice.reducer;
export const { setPending, clearPending } = pendingSlice.actions;
