export interface Movie {
  id: string;
  title: string;
  description: string;
  /** Rating out of 10 */
  rating: number;
  year: number;
  genres: string[];
}
