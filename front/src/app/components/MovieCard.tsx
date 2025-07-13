import React from "react";
import { AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import { BsStarHalf, BsStarFill, BsStar } from "react-icons/bs";
import Image from "next/image";

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

interface MovieCardProps {
  movie: Movie;
  toggleWatched: (movie: Movie) => void;
  toggleLiked: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, toggleWatched, toggleLiked }) => {
  const noteSur5 = movie.user_note / 2;
  const roundedStars = Math.round(noteSur5 * 2) / 2;
  const fullStars = Math.floor(roundedStars);
  const hasHalfStar = roundedStars - fullStars === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="relative w-42 rounded-lg overflow-hidden text-center shadow-lg">
      <div>
        <div className="absolute top-2 right-4 flex gap-2">
          <button
            onClick={() => toggleWatched(movie)}
            className={`opacity-80 p-2 rounded-full text-white hover:bg-gray-700 ${movie.watched ? "bg-gray-700" : ""}`}
          >
            <AiOutlineEye size={20} />
          </button>
          <button
            onClick={() => toggleLiked(movie)}
            className={`opacity-80 p-2 rounded-full text-white hover:bg-gray-700 ${movie.liked ? "bg-red-500" : ""}`}
          >
            <AiOutlineHeart size={20} />
          </button>
        </div>
        <Image
          src={movie.poster_url}
          alt={movie.title}
          width={192}
          height={256}
          className="rounded-2xl mb-2"
        />
      </div>
      <div className="flex items-center justify-center gap-1 mb-2">
        <span className="text-xs text-gray-400 ml-2">{noteSur5.toFixed(2)}/5</span>
        {[...Array(fullStars)].map((_, i) => (
          <BsStarFill key={i} className="text-yellow-400" />
        ))}
        {hasHalfStar && <BsStarHalf className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <BsStar key={fullStars + (hasHalfStar ? 1 : 0) + i} className="text-yellow-400" />
        ))}
      </div>
      <h2 className="text-base mt-2">{movie.title}</h2>
      <p className="text-xs text-accent mb-3">{movie.director} - {movie.year}</p>
    </div>
  );
};

export default MovieCard;
