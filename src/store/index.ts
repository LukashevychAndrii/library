import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/user-slice";
import alertSlice from "./slices/alert-slice";
import themeSlice from "./slices/theme-slice";
import bookSlice from "./slices/book-slice";
import pendingSlice from "./slices/pending-slice";
import scrollSlice from "./slices/scroll-slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    alert: alertSlice,
    theme: themeSlice,
    book: bookSlice,
    pending: pendingSlice,
    scroll: scrollSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
