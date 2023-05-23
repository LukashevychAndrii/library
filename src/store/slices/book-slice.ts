import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  get,
  getDatabase,
  ref,
  query,
  orderByKey,
  startAt,
  endAt,
  equalTo,
  orderByChild,
  orderByValue,
} from "firebase/database";
import { app } from "../../firebase";
import { createAlert } from "./alert-slice";
import { NavigateFunction } from "react-router-dom";
import { clearPending, setPending } from "./pending-slice";

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
  currentBookDetails?: book;
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
    clearCurrentBookDetails(state) {
      state.currentBookDetails = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.books = action.payload;
      console.log("fullfilled");
    });

    builder.addCase(getBooksLength.fulfilled, (state, action) => {
      state.totalLength = action.payload;
    });

    builder.addCase(fetchBookDetails.fulfilled, (state, action) => {
      if (action.payload) {
        state.currentBookDetails = action.payload;
      }
    });
    builder.addCase(fetchFilteredBooks.fulfilled, (state, action) => {
      console.log(action.payload);
      state.books = action.payload;
      state.totalLength = action.payload.length;
    });
  },
});

export default bookSlice.reducer;
export const { setBooks, clearCurrentBookDetails } = bookSlice.actions;

export const fetchBooks = createAsyncThunk<
  book[],
  { start: string; end: string },
  {}
>("book/fetchBooks", async function ({ start, end }, { getState, dispatch }) {
  console.log(start, end);
  const db = getDatabase(app);
  const dbRef = ref(db, `/books`);
  dispatch(setPending());

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
    .catch(() => {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Database error",
          alertType: "error",
        })
      );
    })
    .then(() => {
      dispatch(clearPending());
    });
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

export const fetchBookDetails = createAsyncThunk<
  book | undefined,
  { bookID: string; navigate: NavigateFunction },
  {}
>(
  "book/getBookDetails",
  async function ({ bookID, navigate }, { getState, dispatch }) {
    const db = getDatabase(app);
    const dbRef = ref(db, `/books/${bookID}`);
    let bookData: book | undefined = undefined;
    dispatch(setPending());

    await get(dbRef)
      .then((s) => {
        if (s.exists()) bookData = s.val();
        else {
          navigate("/library");
          dispatch(
            createAlert({
              alertTitle: "Error!",
              alertText: "Database error",
              alertType: "error",
            })
          );
        }
      })
      .then(() => {
        dispatch(clearPending());
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
    return bookData;
  }
);

export const fetchFilteredBooks = createAsyncThunk<
  book[],
  { filter: string; enteredValue: string },
  {}
>(
  "book/fetchFilteredBooks",
  async function ({ filter, enteredValue }, { dispatch }) {
    let filteredBooks: book[] | null = [];
    const db = getDatabase(app);
    const dbRef = ref(db, `books`);
    const dataQuery = query(
      dbRef,
      orderByChild(filter),
      startAt(enteredValue),
      endAt(`${enteredValue}\uf8ff`)
    );

    await get(dataQuery)
      .then((snapshot) => {
        filteredBooks = Object.values(snapshot.val());
        console.log(filteredBooks);
      })
      .catch((error) => {
        console.log(error);
      });

    return filteredBooks;
  }
);
