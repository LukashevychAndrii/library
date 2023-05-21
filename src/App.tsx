import React from "react";
import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootPages/RootLayout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

import { useAppDispatch } from "./hooks/redux";
import { autoLogin } from "./store/slices/user-slice";
import AccDetailsPage from "./pages/AccDetailsPage";
import { setTheme } from "./store/slices/theme-slice";

const router = createBrowserRouter([
  {
    path: "/library",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: "sign-in", element: <SignInPage /> },
      { path: "sign-up", element: <SignUpPage /> },
      { path: "acc-details", element: <AccDetailsPage /> },
    ],
  },
]);
function App() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);

  React.useEffect(() => {
    const theme = localStorage.getItem("theme-library");
    if (theme && theme.length > 0) {
      dispatch(setTheme(theme));
    }
  }, [dispatch]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
