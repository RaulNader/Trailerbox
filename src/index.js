import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./router";
import { WatchedProvider } from "./contexts/WatchedContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WatchedProvider>
      <RouterProvider router={router} />
    </WatchedProvider>
  </React.StrictMode>
);
