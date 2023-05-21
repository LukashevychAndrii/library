import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  get,
  getDatabase,
  ref,
  query,
  orderByKey,
  startAt,
  endAt,
} from "firebase/database";
import { app } from "../../firebase";
import { createAlert } from "./alert-slice";

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
  totalLength: number;
}
const initialState: initialStateI = {
  books: [],
  totalLength: 0,
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
      state.books = action.payload;
    });
    builder.addCase(getBooksLength.fulfilled, (state, action) => {
      state.totalLength = action.payload;
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
  console.log(start, end);
  const db = getDatabase(app);
  const dbRef = ref(db, `/books`);

  let booksData: book[] = [];

  const dataQuery = query(dbRef, orderByKey(), startAt(start), endAt(end));
  await get(dataQuery)
    .then((s) => {
      window.scrollTo({ top: 0, behavior: "smooth", left: 0 });
      if (s.val().length) {
        booksData = s.val();
        booksData = booksData.filter((n) => n);
      } else {
        booksData = Object.values(s.val());
      }
    })
    .then(() => {});
  return booksData;
});

export const getBooksLength = createAsyncThunk<number, undefined, {}>(
  "book/getBooksLength",
  async function (_, { dispatch }) {
    const db = getDatabase(app);
    const dbRef = ref(db, `/books`);
    let count: number = 0;
    await get(dbRef)
      .then((s) => {
        if (s.exists()) {
          count = s.val().length;
        }
      })
      .catch(() => {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "Database error",
            alertType: "error",
          })
        );
      });
    return count;
  }
);
