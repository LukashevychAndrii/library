import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  get,
  getDatabase,
  ref,
  query,
  orderByKey,
  startAt,
  endAt,
  orderByChild,
  update,
  remove,
  set,
} from "firebase/database";
import { app } from "../../firebase";
import { createAlert } from "./alert-slice";
import { NavigateFunction } from "react-router-dom";
import { clearPending, setPending } from "./pending-slice";
import { RootState } from "..";

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
  totalWishlistLength: number;
  currentBookDetails?: book;
  wishlist: book[];
  wishlistIDs: string[];
}
const initialState: initialStateI = {
  books: [],
  totalLength: 0,
  totalWishlistLength: 0,
  wishlist: [],
  wishlistIDs: [],
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
    setBooksLength(state, action) {
      state.totalLength = action.payload.totalLength;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.books = action.payload;
      console.log("fullfilled");
    });

    builder.addCase(getBooksLength.fulfilled, (state, action) => {
      console.log(action.payload);
      state.totalLength = action.payload;
    });

    builder.addCase(fetchBookDetails.fulfilled, (state, action) => {
      if (action.payload) {
        state.currentBookDetails = action.payload;
      }
    });

    builder.addCase(fetchFilteredBooks.fulfilled, (state, action) => {
      state.books = action.payload;
      state.totalLength = action.payload.length;
    });

    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      if (action.payload.wishlist) {
        state.wishlist = action.payload.wishlist;
      }
    });

    builder.addCase(addBookToWishlist.fulfilled, (state, action) => {
      state.wishlist.push(action.payload.bookData);
      state.wishlistIDs.push(`${action.payload.bookData.id}`);
    });

    builder.addCase(removeBookFromWishlist.fulfilled, (state, action) => {
      state.wishlist = state.wishlist.filter(
        (el) => el.id.toString() !== action.payload.bookID
      );

      state.wishlistIDs = state.wishlistIDs.filter(
        (el) => el !== action.payload.bookID
      );
    });

    builder.addCase(getWishlistLength.fulfilled, (state, action) => {
      state.totalWishlistLength = action.payload.totalLength;
    });

    builder.addCase(fetchWishlistIDs.fulfilled, (state, action) => {
      state.wishlistIDs = action.payload.wishlistIDs;
    });
  },
});

export default bookSlice.reducer;
export const { setBooks, clearCurrentBookDetails, setBooksLength } =
  bookSlice.actions;

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
  "book/fetchBookDetails",
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

export const addBookToWishlist = createAsyncThunk<
  { bookData: book },
  { bookID: string; bookData: book },
  {}
>(
  "book/addBookToWishlist",
  async function ({ bookData }, { getState, dispatch }) {
    const appState = getState() as RootState;
    const db = getDatabase(app);
    dispatch(setPending());
    const dbRef = ref(db, `usersDATA/${appState.user.userID}/wishlist/books`);
    if (appState.book.wishlistIDs.indexOf(`${bookData.id}`) !== -1) {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "This book is already in wishlist",
          alertType: "error",
        })
      );
    } else {
      await update(dbRef, { [bookData.id]: { ...bookData, liked: true } })
        .then(async () => {
          const dbRef = ref(
            db,
            `usersDATA/${appState.user.userID}/wishlist/totalLength`
          );

          await get(dbRef).then((s) => {
            let count: number;
            if (s.exists()) {
              count = +s.val().count + 1;
            } else {
              count = 1;
            }
            update(dbRef, { count }).then(() => {
              dispatch(clearPending());
            });
          });
        })
        .catch((e) => {
          console.log(e);
          dispatch(
            createAlert({
              alertTitle: "Error!",
              alertText: "Database error",
              alertType: "error",
            })
          );
        });
    }

    return { bookData: bookData };
  }
);

export const removeBookFromWishlist = createAsyncThunk<
  { bookID: string },
  { bookID: string },
  {}
>(
  "book/removeBookFromWishlist",
  async function ({ bookID }, { getState, dispatch }) {
    const appState = getState() as RootState;
    const db = getDatabase(app);
    const dbRef = ref(
      db,
      `usersDATA/${appState.user.userID}/wishlist/books/${bookID}`
    );
    dispatch(setPending());

    remove(dbRef)
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
    return { bookID: bookID };
  }
);

export const fetchWishlist = createAsyncThunk<
  { wishlist: book[] },
  { start: string; end: string },
  {}
>(
  "book/fetchWishlist",
  async function ({ start, end }, { getState, dispatch }) {
    const appState = getState() as RootState;
    const db = getDatabase(app);
    const dbRef = ref(db, `usersDATA/${appState.user.userID}/wishlist/books`);
    dispatch(setPending());
    let wishlist: book[] = [];
    console.log(start, end);
    const dataQuery = query(dbRef, orderByKey(), startAt(start), endAt(end));

    await get(dataQuery)
      .then((s) => {
        window.scrollTo({ top: 0, behavior: "smooth", left: 0 });
        if (s.exists()) {
          wishlist = s.val();
          if (wishlist.length) {
            wishlist = wishlist.filter((n) => n);
          } else {
            wishlist = Object.values(s.val());
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });

    dispatch(clearPending());

    return { wishlist };
  }
);

export const getWishlistLength = createAsyncThunk<
  { totalLength: number },
  undefined,
  {}
>("book/getWishlistLength", async function (_, { getState, dispatch }) {
  dispatch(setPending());
  const appState = getState() as RootState;
  const db = getDatabase(app);
  let totalLength: number = 0;
  const dbRef = ref(
    db,
    `usersDATA/${appState.user.userID}/wishlist/totalLength/count`
  );
  await get(dbRef)
    .then((s) => {
      totalLength = s.val();
    })
    .then(() => {
      dispatch(clearPending());
    })
    .catch((e) => {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Database error",
          alertType: "error",
        })
      );
    });
  console.log(totalLength);

  return { totalLength };
});

export const fetchWishlistIDs = createAsyncThunk<
  { wishlistIDs: string[] },
  undefined,
  {}
>("book/fetchWishlistIDs", async function (_, { getState, dispatch }) {
  dispatch(setPending());
  const appState = getState() as RootState;
  const db = getDatabase(app);
  let wishlistIDs: string[] = [];
  const dbRef = ref(db, `usersDATA/${appState.user.userID}/wishlist/books`);
  await get(dbRef)
    .then((s) => {
      wishlistIDs = Object.keys(s.val());
      console.log(wishlistIDs);
    })
    .then(() => {
      dispatch(clearPending());
    })
    .catch((e) => {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Database error",
          alertType: "error",
        })
      );
    });

  return { wishlistIDs };
});
