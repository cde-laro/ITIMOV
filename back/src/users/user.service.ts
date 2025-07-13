import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly jwtService: JwtService) {}

  async create(username: string, email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({ username, email, password: hash });
    return createdUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec(); 
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec(); // Use .exec() to return a full Mongoose document
  }

  async generateToken(user: User): Promise<string> {
    const payload = { id: user._id, username: user.username }; // Include the user ID in the payload
    return this.generateJwtToken({ id: user._id.toString(), username: user.username });
  }

  async validateUser(username: string, password: string): Promise<string | null> {
    const user = await this.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return this.generateToken(user); // Generate a token with the user ID
    }
    return null;
  }

  async findUsersByLikedMovie(movieId: Types.ObjectId): Promise<User[]> {
    return this.userModel.find({ likedMovies: movieId }).exec();
  }

  decodeToken(token: string): string {
    try {
      const decoded = this.jwtService.verify(token);
      if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
        return decoded.id as string;
      }
      throw new Error('Invalid token');
    } catch (err) {
      console.error("Error decoding token:", err); // Log error details
      throw new UnauthorizedException("Invalid or malformed token");
    }
  }

  async markMovieAsWatched(userId: string, movieId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.watchedMovies.includes(new Types.ObjectId(movieId))) {
      user.watchedMovies.push(new Types.ObjectId(movieId));
      await user.save();
    }
  }

  async markMovieAsLiked(userId: string, movieId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.likedMovies.includes(new Types.ObjectId(movieId))) {
      user.likedMovies.push(new Types.ObjectId(movieId));
      await user.save();
    }
  }

  async toggleLikedMovie(userId: string, movieId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const index = user.likedMovies.indexOf(new Types.ObjectId(movieId));
    if (index > -1) {
      user.likedMovies.splice(index, 1);
    } else {
      user.likedMovies.push(new Types.ObjectId(movieId)); 
    }
    return user.save();
  }

  async toggleWatchedMovie(userId: string, movieId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const index = user.watchedMovies.indexOf(new Types.ObjectId(movieId));
    if (index > -1) {
      user.watchedMovies.splice(index, 1);
    } else {
      user.watchedMovies.push(new Types.ObjectId(movieId));
    }
    return user.save();
  }

  async generateJwtToken(payload: { id: string; username: string }): Promise<string> {
      return this.jwtService.sign(payload);
    }

  async register(userDto: any): Promise<User> {
    const { username, email, password } = userDto;
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, email, password: hashedPassword });
    return newUser.save();
  }
}