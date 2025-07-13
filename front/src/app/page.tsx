"use client";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import Tabs from "./components/Tabs";
import SortControls from "./components/SortControls";
import MovieList from "./components/MovieList";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function HomePage() {
  // Define the Movie interface
  interface Movie {
    _id: string;
    liked: boolean;
    watched: boolean;
    title: string;
    director: string;
    poster_url: string;
    year: number;
    user_note: number;
  }
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [filter] = useState("");
  const [sortField, setSortField] = useState("user_note");
  const [sortOrder, setSortOrder] = useState("desc");

  const loadMovies = React.useCallback(async () => {
    if (!hasMoreMovies) return;
    setLoading(true);
    try {
      const filters = activeTab === "Liked" ? "&liked=true" : activeTab === "Watched" ? "&watched=true" : "";
      const searchFilter = filter ? `&title=${encodeURIComponent(filter)}` : "";
      const sortParams = sortField ? `&sortField=${sortField}&sortOrder=${sortOrder}` : "";
      const response = await axios.get(`${API_URL}/movies?page=${page}&limit=25${filters}${searchFilter}${sortParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const newMovies: Movie[] = response.data.map((movie: Movie) => ({
        _id: movie._id,
        liked: movie.liked,
        watched: movie.watched,
        title: movie.title,
        director: movie.director,
        poster_url: movie.poster_url,
        year: movie.year,
        user_note: movie.user_note,
      }));
      setMovies((prevMovies) => (page === 1 ? newMovies : [...prevMovies, ...newMovies]));
      if (newMovies.length === 0) {
        setHasMoreMovies(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to fetch movies:", err.message);
      } else {
        console.error("Failed to fetch movies:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, filter, hasMoreMovies, page, sortField, sortOrder]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies, page, activeTab, filter, sortField, sortOrder]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    setHasMoreMovies(true);
  }, [activeTab, filter, sortField, sortOrder]);

  const handleScroll = React.useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleWatched = async (movie: Movie) => {
    try {
      const updatedMovie = { ...movie, watched: !movie.watched };
      await axios.patch(`${API_URL}/movies/${movie._id}/watch`, { watched: updatedMovie.watched }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMovies((prevMovies) =>
        prevMovies.map((m) => (m._id === movie._id ? updatedMovie : m))
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to update watch status:", err.message);
        setError(err.message);
      } else {
        console.error("Failed to update watch status:", err);
        setError("An unknown error occurred.");
      }
    }
  };

  const toggleLiked = async (movie: Movie) => {
    try {
      const updatedMovie = { ...movie, liked: !movie.liked };
      await axios.patch(`${API_URL}/movies/${movie._id}/like`, { liked: updatedMovie.liked }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMovies((prevMovies) =>
        prevMovies.map((m) => (m._id === movie._id ? updatedMovie : m))
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to update like status:", err.message);
        setError(err.message);
      } else {
        console.error("Failed to update like status:", err);
        setError("An unknown error occurred.");
      }
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-5 text-white font-sans max-w-7xl mx-auto">
      <h1 className="text-3xl font- mb-5">My Movies</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <SortControls sortField={sortField} setSortField={setSortField} sortOrder={sortOrder} setSortOrder={setSortOrder} />
      <MovieList movies={movies} toggleWatched={toggleWatched} toggleLiked={toggleLiked} />
      {loading && <p>Loading...</p>}
    </div>
  );
}
