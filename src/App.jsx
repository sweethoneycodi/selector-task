import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import CreateEdit from "./CreateEdit";
import { initDB } from "react-indexed-db-hook";
import { DBConfig } from "./configs";

initDB(DBConfig);

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <CreateEdit />,
    },
    {
      path: "edit/:id",
      element: <CreateEdit />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
