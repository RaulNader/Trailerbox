import { createBrowserRouter, Navigate } from "react-router";
import AppLayout from "./layouts/AppLayout";
import BrowsePage from "./pages/BrowsePage";
import CatalogPage from "./pages/CatalogPage";
import MyListPage from "./pages/MyListPage";
import TitleModal from "./pages/TitleModal";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
import type { TitleType } from "./types";

// Every section gets a nested `:id` route that opens the details modal
// on top of the page, e.g. /movies/tt0816692
const titleRoute = { path: ":id", element: <TitleModal /> };

// A type's home page plus its catalogs: /movies, /movies/popular, /movies/genre/Action
const browseRoutes = (path: string, type: TitleType) => [
  { path, element: <BrowsePage type={type} />, children: [titleRoute] },
  {
    path: `${path}/popular`,
    element: <CatalogPage type={type} />,
    children: [titleRoute],
  },
  {
    path: `${path}/genre/:genre`,
    element: <CatalogPage type={type} />,
    children: [titleRoute],
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        // Pathless route: errors render inside the layout, keeping the navbar
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Navigate to="/movies" replace /> },
          ...browseRoutes("movies", "movie"),
          ...browseRoutes("series", "series"),
          {
            path: "my-list",
            element: <MyListPage />,
            children: [titleRoute],
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
