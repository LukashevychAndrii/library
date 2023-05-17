import React from "react";
import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootPages/RootLayout";
import HomePage from "./pages/HomePage";

import { loader as BooksLoader } from "./pages/HomePage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "library",
        children: [
          {
            index: true,
            element: <HomePage />,
            loader: BooksLoader,
          },
        ],
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
