import React from "react";
import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootPages/RootLayout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { autoLogin } from "./store/slices/user-slice";
import AccDetailsPage from "./pages/AccDetailsPage";
import { setTheme } from "./store/slices/theme-slice";
import {
  fetchPinnedBooks,
  fetchWishlist,
  scrollTop,
} from "./store/slices/book-slice";
import BookDetailsPage from "./pages/BookDetailsPage";
import WishlistPage from "./pages/WishlistPage";

import SimpleBarCore from "simplebar-react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/library",
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          { path: "sign-in", element: <SignInPage /> },
          { path: "sign-up", element: <SignUpPage /> },
          { path: "acc-details", element: <AccDetailsPage /> },
          { path: ":bookID", element: <BookDetailsPage /> },
        ],
      },
      {
        path: "/wishlist",
        element: <WishlistPage />,
        children: [{ path: ":bookID", element: <BookDetailsPage /> }],
      },
    ],
  },
]);
function App() {
  const dispatch = useAppDispatch();
  const userID = useAppSelector((state) => state.user.userID);
  React.useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);
  React.useEffect(() => {
    if (userID) {
      dispatch(fetchPinnedBooks());
      dispatch(fetchWishlist());
    }
  }, [userID, dispatch]);

  React.useEffect(() => {
    const theme = localStorage.getItem("theme-library");
    if (theme && theme.length > 0) {
      dispatch(setTheme(theme));
    }
  }, [dispatch]);

  const scrollableNodeRef = React.useRef<any>(null);
  const scroll = useAppSelector((state) => state.book.scrollTop);
  React.useEffect(() => {
    if (scroll) {
      scrollableNodeRef.current.scrollTo({ top: 0, behavior: "smooth" });
      dispatch(scrollTop(false));
    }
  }, [scroll, dispatch]);

  return (
    <SimpleBar
      scrollableNodeProps={{ ref: scrollableNodeRef }}
      style={{ maxHeight: "100vh" }}
      autoHide={false}
    >
      <RouterProvider router={router}></RouterProvider>
    </SimpleBar>
  );
}

export default App;
