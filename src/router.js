import { createBrowserRouter, Navigate } from "react-router";
import AppLayout from "./layouts/AppLayout";
import BrowsePage from "./pages/BrowsePage";
import MyListPage from "./pages/MyListPage";
import TitleModal from "./pages/TitleModal";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";

// Every section gets a nested `:id` route that opens the details modal
// on top of the page, e.g. /movies/tt0816692
const titleRoute = { path: ":id", element: <TitleModal /> };

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
          {
            path: "movies",
            element: <BrowsePage type="movie" />,
            children: [titleRoute],
          },
          {
            path: "series",
            element: <BrowsePage type="series" />,
            children: [titleRoute],
          },
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
