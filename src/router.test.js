// jsdom in Jest 27 lacks TextEncoder, which React Router 7 needs at import time,
// so polyfill it before requiring the router (imports would be hoisted)
const { TextEncoder, TextDecoder } = require("util");
Object.assign(global, { TextEncoder, TextDecoder });
const { render, screen, waitFor, fireEvent } = require("@testing-library/react");
const { createMemoryRouter, RouterProvider } = require("react-router");
const { router } = require("./router");
const { WatchedProvider } = require("./contexts/WatchedContext");

beforeAll(() => {
  window.scrollTo = () => {};
  global.fetch = async (url) => ({
    ok: true,
    json: async () =>
      /[?&]i=/.test(url)
        ? { Response: "True", Title: "Interstellar", Year: "2014", imdbRating: "8.7", Plot: "Space.", Poster: "N/A" }
        : { Response: "True", totalResults: "1", Search: [{ imdbID: "tt1", Title: "Batman Begins", Year: "2005", Poster: "N/A", Type: "movie" }] },
  });
});

function renderAt(path) {
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
  const [card] = await screen.findAllByLabelText("Batman Begins (2005)");
  expect(card.getAttribute("href")).toBe("/movies/tt1");
  fireEvent.click(card);
  await waitFor(() => expect(r.state.location.pathname).toBe("/movies/tt1"));
  fireEvent.click(await screen.findByLabelText("Close"));
  await waitFor(() => expect(r.state.location.pathname).toBe("/movies"));
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
