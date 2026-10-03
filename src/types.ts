export type TitleType = "movie" | "series";
export type TabId = TitleType | "list";

// OMDb answers with capitalised keys and "N/A" for missing values
export interface OmdbSearchItem {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface OmdbSearchResponse {
  Search: OmdbSearchItem[];
  totalResults: string;
}

export interface OmdbDetails {
  Title: string;
  Year: string;
  Poster: string;
  Runtime: string;
  imdbRating: string;
  Plot: string;
  Released: string;
  Actors: string;
  Director: string;
  Writer: string;
  Genre: string;
  Rated: string;
  Type: string;
  totalSeasons?: string;
}

// A Cinemeta catalog entry (Stremio "meta preview"); only the fields we read
export interface CinemetaMeta {
  id: string;
  imdb_id?: string;
  name: string;
  releaseInfo?: string;
  year?: string;
  poster?: string;
  type: string;
}

// An entry of My List, saved to localStorage
export interface WatchedMovie {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  type: string;
  imdbRating: number;
  runtime: number;
  userRating: number;
}

// The common shape every card renders, whatever the source
export interface CardMovie {
  id: string;
  title: string;
  year?: string;
  poster?: string;
  type?: string;
}
