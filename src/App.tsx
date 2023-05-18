import React from "react";
import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootPages/RootLayout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

import { loader as BooksLoader } from "./pages/HomePage";
import { useAppDispatch } from "./hooks/redux";
import { autoLogin } from "./store/slices/user-slice";

const router = createBrowserRouter([
  {
    path: "/library",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: BooksLoader,
      },
      { path: "sign-in", element: <SignInPage /> },
      { path: "sign-up", element: <SignUpPage /> },
    ],
  },
]);
function App() {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
