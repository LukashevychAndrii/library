import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  get,
  getDatabase,
  ref,
  query,
  limitToFirst,
  limitToLast,
  orderByKey,
  startAt,
  endAt,
  orderByPriority,
} from "firebase/database";
import { app } from "../../firebase";

export interface book {
  author: string;
  country: string;
  imageLink: string;
  language: string;
  link: string;
  pages: number;
  title: string;
  year: number;
  id: number;
  liked: boolean;
}

interface initialStateI {
  books: book[];
}
const initialState: initialStateI = {
  books: [],
};

const bookSlice = createSlice({
  name: "book",
  initialState: initialState,
  reducers: {
    setBooks(state, action) {
      state.books = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      console.log(action.payload);
      state.books = action.payload;
    });
  },
});

export default bookSlice.reducer;
export const { setBooks } = bookSlice.actions;

export const fetchBooks = createAsyncThunk<
  book[],
  { start: string; end: string },
  {}
>("book/fetchBooks", async function ({ start, end }, { getState, dispatch }) {
  const db = getDatabase(app);
  const dbRef = ref(db, `/books`);

  let booksData: book[] = [];

  const dataQuery = query(dbRef, orderByKey(), startAt(start), endAt(end));
  await get(dataQuery).then((s) => (booksData = s.val()));

  return booksData;
});
