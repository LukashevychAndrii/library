import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
  push,
} from "firebase/database";
import { app } from "../../firebase";
import { createAlert } from "./alert-slice";
import { NavigateFunction } from "react-router-dom";
import { pendingUpdateQueueUp, pendingUpdateQueueDown } from "./pending-slice";
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
  pinnedBooks: book[];
}
const initialState: initialStateI = {
  books: [],
  totalLength: 0,
  totalWishlistLength: 0,
  wishlist: [],
  wishlistIDs: [],
  pinnedBooks: [],
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
    setWishlistLength(state, action: PayloadAction<number>) {
      state.totalWishlistLength = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.books = action.payload;
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
      const end = action.payload.page * 10;
      const start = end - 10;
      const fetchedBooks = action.payload.books.filter((el) => el);
      console.log(fetchedBooks);
      state.books = fetchedBooks.slice(start, end);
      state.totalLength = fetchedBooks.length;
    });

    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      if (action.payload.wishlist && action.payload.wishlistIDs) {
        state.wishlist = action.payload.wishlist;
        state.totalWishlistLength = action.payload.wishlist.length;
        state.wishlistIDs = action.payload.wishlistIDs;
      }
    });

    builder.addCase(addBookToWishlist.fulfilled, (state, action) => {
      state.wishlist.push(action.payload.bookData);
    });

    builder.addCase(removeBookFromWishlist.fulfilled, (state, action) => {
      if (action.payload && action.payload?.bookID) {
        state.wishlist = state.wishlist.filter(
          (el) => el.id.toString() !== action.payload?.bookID
        );

        state.totalWishlistLength = state.totalWishlistLength - 1;
      }
    });

    builder.addCase(fetchPinnedBooks.fulfilled, (state, action) => {
      state.pinnedBooks = action.payload.pinnedBooks;
    });
    builder.addCase(pinBook.fulfilled, (state, action) => {
      if (action.payload?.newPinnedBook)
        state.pinnedBooks.push(action.payload.newPinnedBook);
    });
    builder.addCase(unpinBook.fulfilled, (state, action) => {
      state.pinnedBooks = state.pinnedBooks.filter(
        (el) => el.id !== action.payload.bookID
      );
    });
    // builder.addCase(fetchFilteredWishlistBooks.fulfilled, (state, action) => {
    //   const end = +action.payload.page * 10;
    //   const start = end - 10;
    //   const fetchedBooks = action.payload.books.filter((el) => el);
    //   state.wishlist = fetchedBooks.slice(start, end);
    //   console.log(fetchedBooks.slice(start, end));
    //   state.totalWishlistLength = fetchedBooks.length;
    // });
  },
});

export default bookSlice.reducer;
export const {
  setBooks,
  clearCurrentBookDetails,
  setBooksLength,
  setWishlistLength,
} = bookSlice.actions;

export const fetchBooks = createAsyncThunk<
  book[],
  { start: string; end: string },
  {}
>("book/fetchBooks", async function ({ start, end }, { getState, dispatch }) {
  const db = getDatabase(app);
  const dbRef = ref(db, `/books`);
  dispatch(pendingUpdateQueueUp());

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
      dispatch(pendingUpdateQueueDown());
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
    dispatch(pendingUpdateQueueUp());

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
        dispatch(pendingUpdateQueueDown());
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
  { books: book[]; page: number },
  { filter: string; enteredValue: string; comparison?: string; page: number },
  {}
>(
  "book/fetchFilteredBooks",
  async function ({ filter, enteredValue, comparison, page }, { dispatch }) {
    let filteredBooks: book[] | null = [];
    const db = getDatabase(app);
    const dbRef = ref(db, `books`);

    if (comparison) {
      if (comparison === "less" || comparison === "earlier") {
        if (filter === "year" || filter === "pages") {
          const filteredBooksQuery = query(
            dbRef,
            orderByChild(filter),
            endAt(+enteredValue)
          );
          await get(filteredBooksQuery).then((snapshot) => {
            if (snapshot.exists()) {
              console.log(snapshot.val());
              if (snapshot.val().length) {
                filteredBooks = snapshot.val();
              } else {
                filteredBooks = Object.values(snapshot.val());
              }
            }
          });
          return { books: filteredBooks, page: page };
        }
      } else if (comparison === "more" || comparison === "later") {
        if (filter === "year" || filter === "pages") {
          const filteredBooksQuery = query(
            dbRef,
            orderByChild(filter),
            startAt(+enteredValue)
          );
          await get(filteredBooksQuery).then((snapshot) => {
            if (snapshot.exists()) {
              console.log(snapshot.val());
              if (snapshot.val().length) {
                filteredBooks = snapshot.val();
              } else {
                filteredBooks = Object.values(snapshot.val());
              }
            }
          });
          return { books: filteredBooks, page: page };
        }
      }
    }

    const dataQuery = query(
      dbRef,
      orderByChild(filter),
      startAt(enteredValue),
      endAt(`${enteredValue}\uf8ff`)
    );

    await get(dataQuery)
      .then((snapshot) => {
        if (snapshot.exists()) filteredBooks = Object.values(snapshot.val());
      })
      .catch((error) => {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "Fetching filtered books failed",
            alertType: "error",
          })
        );
      });

    return { books: filteredBooks, page: page };
  }
);

// export const fetchFilteredWishlistBooks = createAsyncThunk<
//   { books: book[]; page: number },
//   { categorie: string; property: string; page: number; comparison?: string },
//   {}
// >(
//   "book/fetchFilteredWishlistBooks",
//   async function ({ categorie, property, page }, { getState }) {
//     let filteredBooks: book[] = [];
//     const appState = getState() as RootState;
//     filteredBooks = appState.book.wishlist.filter((el: book) =>
//       el[categorie as keyof book].toString().includes(property)
//     );
//     console.log(filteredBooks);
//     return { books: filteredBooks, page: page };
//   }
// );

export const addBookToWishlist = createAsyncThunk<
  { bookData: book },
  { bookID: string; bookData: book },
  {}
>(
  "book/addBookToWishlist",
  async function ({ bookData }, { getState, dispatch }) {
    const appState = getState() as RootState;
    const db = getDatabase(app);
    dispatch(pendingUpdateQueueUp());
    const dbRef = ref(db, `usersDATA/${appState.user.userID}/wishlist/books`);
    if (appState.user.userID) {
      if (!appState.book.wishlist.find((el) => el.id === bookData.id)) {
        await push(dbRef, bookData).catch(() => {
          dispatch(
            createAlert({
              alertTitle: "Error!",
              alertText: "Database error",
              alertType: "error",
            })
          );
        });
      } else {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "This book is already in wishlist",
            alertType: "error",
          })
        );
      }
    } else {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "You must have an account to add books to wishlist",
          alertType: "error",
        })
      );
    }

    dispatch(pendingUpdateQueueDown());
    return { bookData };
  }
);

export const removeBookFromWishlist = createAsyncThunk<
  { bookID: string } | null,
  { bookID: string },
  {}
>(
  "book/removeBookFromWishlist",
  async function ({ bookID }, { getState, dispatch }) {
    const appState = getState() as RootState;
    const db = getDatabase(app);
    if (appState.user.userID) {
      const id =
        appState.book.wishlistIDs[
          appState.book.wishlist.findIndex((el) => el.id === +bookID)
        ];
      const dbRef = ref(
        db,
        `usersDATA/${appState.user.userID}/wishlist/books/${id}`
      );
      dispatch(pendingUpdateQueueUp());
      remove(dbRef).catch(() => {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "Database error",
            alertType: "error",
          })
        );
      });
      dispatch(pendingUpdateQueueDown());
      return { bookID: bookID };
    } else {
      return null;
    }
  }
);

export const fetchWishlist = createAsyncThunk<
  { wishlistIDs: string[]; wishlist: book[] },
  undefined,
  {}
>("book/fetchWishlist", async function (_, { getState, dispatch }) {
  const appState = getState() as RootState;
  const db = getDatabase(app);
  const dbRef = ref(db, `usersDATA/${appState.user.userID}/wishlist/books`);
  dispatch(pendingUpdateQueueUp());
  let wishlist: book[] = [];
  let wishlistIDs: string[] = [];
  await get(dbRef)
    .then((s) => {
      if (s.exists()) {
        console.log(s.val());
        wishlistIDs = Object.keys(s.val());
        wishlist = Object.values(s.val());
      }
    })
    .catch((e) => {
      console.log(e);
    });

  dispatch(pendingUpdateQueueDown());

  return { wishlistIDs, wishlist };
});

export const fetchPinnedBooks = createAsyncThunk<
  { pinnedBooks: book[] },
  undefined,
  {}
>("book/fetchPinnedBooks", async function (_, { getState, dispatch }) {
  let pinnedBooks: book[] = [];
  const db = getDatabase();
  const appState = getState() as RootState;
  const dbRef = ref(
    db,
    `usersDATA/${appState.user.userID}/wishlist/pinnedBooks`
  );
  dispatch(pendingUpdateQueueUp());
  await get(dbRef)
    .then((s) => {
      if (s.exists()) pinnedBooks = Object.values(s.val());
    })
    .catch((e) => {
      console.log(e);
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "An error occured while fetching pinned books",
          alertType: "error",
        })
      );
    });
  dispatch(pendingUpdateQueueDown());
  return { pinnedBooks };
});

export const pinBook = createAsyncThunk<
  { newPinnedBook: book } | null,
  { bookData: book },
  {}
>("book/pinBook", async function ({ bookData }, { getState, dispatch }) {
  let newPinnedBook: book = bookData;
  const db = getDatabase();
  const appState = getState() as RootState;
  const dbRef = ref(
    db,
    `usersDATA/${appState.user.userID}/wishlist/pinnedBooks`
  );

  dispatch(pendingUpdateQueueUp());

  const pBooksLength = appState.book.pinnedBooks.length;
  if (appState.user.userID) {
    if (pBooksLength + 1 > 5) {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Max count of pinned books is 5!",
          alertType: "error",
        })
      );
    } else {
      await update(dbRef, { [bookData.id]: bookData }).catch(() => {
        createAlert({
          alertTitle: "Error!",
          alertText: "Database error",
          alertType: "error",
        });
      });
    }
    dispatch(pendingUpdateQueueDown());

    if (pBooksLength <= 5) {
      return { newPinnedBook };
    }
  } else {
    dispatch(
      createAlert({
        alertTitle: "Error!",
        alertText: "You must have an account to pin book",
        alertType: "error",
      })
    );
  }
  dispatch(pendingUpdateQueueDown());

  return null;
});

export const unpinBook = createAsyncThunk<
  { bookID: number },
  { bookID: number },
  {}
>("book/unpinBook", async function ({ bookID }, { getState, dispatch }) {
  const db = getDatabase();
  const appState = getState() as RootState;
  const dbRef = ref(
    db,
    `usersDATA/${appState.user.userID}/wishlist/pinnedBooks/${bookID}`
  );

  dispatch(pendingUpdateQueueUp());

  await remove(dbRef).catch(() => {
    createAlert({
      alertTitle: "Error!",
      alertText: "Database error",
      alertType: "error",
    });
  });

  dispatch(pendingUpdateQueueDown());

  return { bookID };
});
