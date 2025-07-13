import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie } from './movie.schema';
import { User } from '../users/user.schema';
import { SortOrder } from 'mongoose';

interface MovieWithUserStatus {
  liked: boolean;
  watched: boolean;
  title: string;
  director: string;
  year: number;
  duration: number;
  poster_url?: string;
  user_note?: number;
  _id: unknown;
  __v: number;
}

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  // async findAll(page: number, limit: number) {
  //   const skip = (page - 1) * limit;
  //   return this.movieModel.find().skip(skip).limit(limit).exec();
  // }

  async findById(id: string) {
    return this.movieModel.findById(id).exec();
  }

  async create(movieData: Partial<Movie>) {
    const createdMovie = new this.movieModel(movieData);
    return createdMovie.save();
  }

  async getMoviesWithUserStatus(userId: string): Promise<MovieWithUserStatus[]> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const movies = await this.movieModel.find().exec();
    return movies.map((movie) => ({
      ...movie.toObject(),
      liked: user.likedMovies.some((likedMovieId) =>
        likedMovieId.equals(new Types.ObjectId(movie._id as Types.ObjectId))
      ),
      watched: user.watchedMovies.some((watchedMovieId) =>
        watchedMovieId.equals(new Types.ObjectId(movie._id as Types.ObjectId))
      ),
    }));
  }

  async likeMovie(movieId: string, userId: string): Promise<Movie> {
    const movie = await this.movieModel.findById(movieId);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const movieObjectId = new Types.ObjectId(movieId);

    if (user.likedMovies.some((likedMovieId) => likedMovieId.equals(movieObjectId))) {
      // Remove the movie from likedMovies (dislike)
      user.likedMovies = user.likedMovies.filter(
        (likedMovieId) => !likedMovieId.equals(movieObjectId)
      );
    } else {
      // Add the movie to likedMovies (like)
      user.likedMovies.push(movieObjectId);
    }

    await user.save();
    return movie;
  }

  async watchMovie(movieId: string, userId: string): Promise<Movie> {
    const movie = await this.movieModel.findById(movieId);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.watchedMovies.some((watchedMovieId) => watchedMovieId.equals(new Types.ObjectId(movieId)))) {
      user.watchedMovies.push(new Types.ObjectId(movieId));
    } else {
      user.watchedMovies = user.watchedMovies.filter(
        (watchedMovieId) => !watchedMovieId.equals(new Types.ObjectId(movieId))
      );
    }
    await user.save();

    return movie;
  }

  async findAllWithUserStatus(
    userId: string,
    page: number,
    limit: number,
    filters: { liked?: boolean; watched?: boolean },
    sort?: { field: 'year' | 'user_note'; order: 'asc' | 'desc' }
  ): Promise<MovieWithUserStatus[]> {
    const query: any = {};
    if (filters.liked) {
      const user = await this.userModel.findById(userId).select('likedMovies');
      query._id = { $in: user?.likedMovies || [] };
    }
    if (filters.watched) {
      const user = await this.userModel.findById(userId).select('watchedMovies');
      query._id = { $in: user?.watchedMovies || [] };
    }

    const sortQuery: Record<string, SortOrder> | undefined = sort
      ? { [sort.field]: sort.order === 'asc' ? 1 : -1 }
      : undefined;

    let queryBuilder = this.movieModel.find(query);
    console.log('Applying sort:', sortQuery);
    console.log('Applying filters:', filters);
    console.log('Query:', query);
    console.log('Page:', page, 'Limit:', limit);
    if (sortQuery) {
      queryBuilder = queryBuilder.sort(sortQuery);
    }

    const movies = await queryBuilder
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const user = await this.userModel.findById(userId);

    return movies.map((movie) => ({
      ...movie.toObject(),
      liked: user?.likedMovies.some((likedMovieId) =>
        likedMovieId.equals(new Types.ObjectId(movie._id as Types.ObjectId))
      ) || false,
      watched: user?.watchedMovies.some((watchedMovieId) =>
        watchedMovieId.equals(new Types.ObjectId(movie._id as Types.ObjectId))
      ) || false,
    }));
  }
}
