export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  year: number;
  runtime: number;
  genres: string[];
  description: string;
  cast: string[];
  director: string;
  streamingOn: string[];
  isFeatured?: boolean;
}

export type Genre = 'Action' | 'Drama' | 'Comedy' | 'Sci-Fi' | 'Horror' | 'Romance' | 'Thriller' | 'Animation';

export interface Review {
  id: string;
  movieId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}
