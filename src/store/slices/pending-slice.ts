import { createSlice } from "@reduxjs/toolkit";

interface initialStateI {
  pendingQueue: 0;
}

const initialState: initialStateI = {
  pendingQueue: 0,
};

const pendingSlice = createSlice({
  name: "pending",
  initialState: initialState,
  reducers: {
    pendingUpdateQueueUp(state) {
      state.pendingQueue++;
    },
    pendingUpdateQueueDown(state) {
      if (state.pendingQueue > 0) state.pendingQueue--;
    },
  },
});

export default pendingSlice.reducer;
export const { pendingUpdateQueueUp, pendingUpdateQueueDown } =
  pendingSlice.actions;
