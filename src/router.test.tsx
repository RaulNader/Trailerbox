import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { router } from "./router";
import { WatchedProvider } from "./contexts/WatchedContext";

beforeAll(() => {
  window.scrollTo = () => {};
  vi.stubGlobal("fetch", async (url: string) => ({
    ok: true,
    json: async () =>
      url.includes("strem.io")
        ? { metas: [{ id: "tt1", imdb_id: "tt1", name: "Batman Begins", releaseInfo: "2005", poster: "", type: "movie" }] }
        : /[?&]i=/.test(url)
        ? { Response: "True", Title: "Interstellar", Year: "2014", imdbRating: "8.7", Plot: "Space.", Poster: "N/A" }
        : { Response: "True", totalResults: "1", Search: [{ imdbID: "tt1", Title: "Batman Begins", Year: "2005", Poster: "N/A", Type: "movie" }] },
  }));
});

function renderAt(path: string) {
  const memory = createMemoryRouter(router.routes, { initialEntries: [path] });
  render(<WatchedProvider><RouterProvider router={memory} /></WatchedProvider>);
  return memory;
}

test("/ redirects to /movies and shows hero + sections", async () => {
  const r = renderAt("/");
  await waitFor(() => expect(r.state.location.pathname).toBe("/movies"));
  expect(await screen.findByRole("heading", { name: "Interstellar" })).toBeTruthy();
  expect((await screen.findAllByLabelText("Batman Begins (2005)")).length).toBeGreaterThan(0);
});

test("card opens nested title route, close goes back", async () => {
  const r = renderAt("/movies");
  const card = (await screen.findAllByLabelText("Batman Begins (2005)"))[0]!;
  expect(card.getAttribute("href")).toBe("/movies/tt1");
  fireEvent.click(card);
  await waitFor(() => expect(r.state.location.pathname).toBe("/movies/tt1"));
  fireEvent.click(await screen.findByLabelText("Close"));
  await waitFor(() => expect(r.state.location.pathname).toBe("/movies"));
});

test("home page shows a row per genre with See all links", async () => {
  renderAt("/series");
  expect(await screen.findByRole("heading", { name: "Reality-TV" })).toBeTruthy();
  const seeAll = screen
    .getAllByRole("link")
    .find((link) => link.textContent === "See all Popular series ›");
  expect(seeAll?.getAttribute("href")).toBe("/series/popular");
});

test("genre catalog page lists titles and opens nested modal", async () => {
  const r = renderAt("/movies/genre/Sci-Fi");
  expect(await screen.findByRole("heading", { name: "Sci-Fi Movies" })).toBeTruthy();
  const card = (await screen.findAllByLabelText("Batman Begins (2005)"))[0]!;
  expect(card.getAttribute("href")).toBe("/movies/genre/Sci-Fi/tt1");
  fireEvent.click(card);
  await waitFor(() => expect(r.state.location.pathname).toBe("/movies/genre/Sci-Fi/tt1"));
  fireEvent.click(await screen.findByLabelText("Close"));
  await waitFor(() => expect(r.state.location.pathname).toBe("/movies/genre/Sci-Fi"));
});

test("each page sets its own document title, the modal overrides it", async () => {
  const r = renderAt("/movies/genre/Sci-Fi");
  await waitFor(() => expect(document.title).toBe("Sci-Fi Movies | usePopcorn"));
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Sci-Fi Movies");
  fireEvent.click((await screen.findAllByLabelText("Batman Begins (2005)"))[0]!);
  await waitFor(() => expect(document.title).toBe("Interstellar (2014) | usePopcorn"));
  fireEvent.click(await screen.findByLabelText("Close"));
  await waitFor(() => expect(r.state.location.pathname).toBe("/movies/genre/Sci-Fi"));
  await waitFor(() => expect(document.title).toBe("Sci-Fi Movies | usePopcorn"));
});

test("unknown genre shows a message", async () => {
  renderAt("/movies/genre/Nope");
  expect(await screen.findByText("No such category")).toBeTruthy();
});

test("search param shows results", async () => {
  renderAt("/series?q=batman");
  expect(await screen.findByText(/Series matching/)).toBeTruthy();
});

test("deep link opens modal, close goes to parent keeping search", async () => {
  const r = renderAt("/movies/tt0816692?q=bat");
  expect(await screen.findByRole("dialog")).toBeTruthy();
  fireEvent.click(await screen.findByLabelText("Close"));
  await waitFor(() => expect(r.state.location.pathname + r.state.location.search).toBe("/movies?q=bat"));
});

test("my list empty state", async () => {
  renderAt("/my-list");
  expect(await screen.findByText("Your list is empty")).toBeTruthy();
});

test("unknown route shows 404", async () => {
  renderAt("/nope");
  expect(await screen.findByText("Lost your way?")).toBeTruthy();
});
