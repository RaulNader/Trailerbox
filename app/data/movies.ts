import type { Movie } from "~/types/movie";

export const movies: Movie[] = [
  {
    id: "inception",
    title: "Inception",
    description:
      "A thief who steals secrets through dream-sharing tech is offered a chance to wipe his record by planting an idea in a target's mind.",
    rating: 8.8,
    year: 2010,
    genres: ["Sci-Fi", "Action"],
  },
  {
    id: "spirited-away",
    title: "Spirited Away",
    description:
      "A 10-year-old girl wanders into a world of spirits and must work in a bathhouse to free herself and her parents.",
    rating: 8.6,
    year: 2001,
    genres: ["Animation", "Fantasy"],
  },
  {
    id: "the-dark-knight",
    title: "The Dark Knight",
    description:
      "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.",
    rating: 9.0,
    year: 2008,
    genres: ["Action", "Crime"],
  },
  {
    id: "parasite",
    title: "Parasite",
    description:
      "A poor family schemes its way into working for a wealthy household, until an unexpected discovery changes everything.",
    rating: 8.5,
    year: 2019,
    genres: ["Thriller", "Drama"],
  },
  {
    id: "interstellar",
    title: "Interstellar",
    description:
      "A team of explorers travels through a wormhole in search of a new home for humanity.",
    rating: 8.7,
    year: 2014,
    genres: ["Sci-Fi", "Drama"],
  },
  {
    id: "whiplash",
    title: "Whiplash",
    description:
      "A young drummer enrolls at a cut-throat music conservatory and meets an instructor who'll stop at nothing.",
    rating: 8.5,
    year: 2014,
    genres: ["Drama", "Music"],
  },
];
