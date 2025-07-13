import React from "react";
import MovieCard from "./MovieCard"

interface Movie {
  _id: string;
  title: string;
  director: string;
  poster_url: string;
  year: number;
  watched: boolean;
  liked: boolean;
  user_note: number;
}

interface MovieListProps {
  movies: Movie[];
  toggleWatched: (movie: Movie) => void;
  toggleLiked: (movie: Movie) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, toggleWatched, toggleLiked }) => {
  return (
    <div className="flex flex-wrap justify-around">
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          toggleWatched={toggleWatched}
          toggleLiked={toggleLiked}
        />
      ))}
    </div>
  );
};

export default MovieList;
