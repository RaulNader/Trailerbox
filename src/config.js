export const API_URL = "https://www.omdbapi.com/";
export const API_KEY = process.env.REACT_APP_OMDB_KEY;

if (!API_KEY && process.env.NODE_ENV !== "test")
  console.error("Missing REACT_APP_OMDB_KEY. Copy .env.example to .env and add your OMDb key.");

export const MIN_QUERY_LENGTH = 3;
export const SEARCH_DEBOUNCE_MS = 400;
export const WATCHED_STORAGE_KEY = "watched";

export const TABS = [
  { id: "movie", label: "Movies", to: "/movies" },
  { id: "series", label: "Series", to: "/series" },
  { id: "list", label: "My List", to: "/my-list" },
];

// OMDb has no "trending" endpoint, so the home page is built from curated searches
export const BROWSE = {
  movie: {
    featuredId: "tt0816692", // Interstellar
    sections: [
      { title: "Superhero Blockbusters", query: "Avengers" },
      { title: "The Dark Knight Saga", query: "Batman" },
      { title: "A Galaxy Far, Far Away", query: "Star Wars" },
      { title: "Wizarding World", query: "Harry Potter" },
    ],
  },
  series: {
    featuredId: "tt0903747", // Breaking Bad
    sections: [
      { title: "Here Be Dragons", query: "Dragon" },
      { title: "Marvel Universe", query: "Marvel" },
      { title: "Boldly Go", query: "Star Trek" },
      { title: "Crime & Detectives", query: "Sherlock" },
      { title: "Comedy Classics", query: "The Office" },
    ],
  },
};
