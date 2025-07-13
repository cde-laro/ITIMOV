import * as mongoose from 'mongoose';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  year: Number,
  duration: Number,
  poster_url: String,
  user_note: Number,
});

const Movie = mongoose.model('Movie', movieSchema);

interface MovieData {
  title: string;
  director: string;
  year: number;
  duration: number;
  poster_url: string;
  user_note: number;
}

async function fetchPopularMoviesFromTMDB(page: number): Promise<any[]> {
  const apiKey = process.env.TMDB_API_KEY;

  while (true) {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200'`, {
        params: {
          api_key: apiKey,
          page,
        },
      });
      return response.data.results;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } else {
        throw error;
      }
    }
  }
}

async function fetchMovieDirector(movieId: number): Promise<string> {
  const apiKey = process.env.TMDB_API_KEY;

  while (true) {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        params: {
          api_key: apiKey,
        },
      });
      const director = response.data.crew.find((member: any) => member.job === 'Director');
      return director ? director.name : '';
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } else {
        throw error;
      }
    }
  }
}

async function importMovies() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://mongodb:27017/movies';
  await mongoose.connect(mongoUri);

  const count = await Movie.countDocuments();
  if (count > 0) {
    await mongoose.disconnect();
    return;
  }

  const moviesToInsert: MovieData[] = [];
  for (let page = 1; page <= 50; page++) {
    const movies = await fetchPopularMoviesFromTMDB(page);
    for (const movie of movies) {
      if (!movie.release_date || isNaN(new Date(movie.release_date).getFullYear())) {
        continue;
      }
      if (movie.adult) {
        continue;
      }

      const releaseDate = new Date(movie.release_date);
      const year = releaseDate.getFullYear();
      const director = await fetchMovieDirector(movie.id);

      moviesToInsert.push({
        title: movie.title,
        director,
        year,
        duration: movie.runtime || 0,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        user_note: movie.vote_average,
      });
    }
  }

  await Movie.insertMany(moviesToInsert);

  await mongoose.disconnect();
}

importMovies().catch((err) => {
  process.exit(1);
});
