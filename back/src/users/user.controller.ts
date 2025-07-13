import { Controller, BadRequestException, Get, Post, Body, Param, UnauthorizedException, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../middleware/jwt.middleware';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.userModel.find().exec();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userModel.findById(id).exec();
  }

  @Post()
  async create(@Body() createUserDto: Partial<User>) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  @Get(':id/movies/:movieId')
  async hasSeenMovie(@Param('id') id: string, @Param('movieId') movieId: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hasSeen = user.isMovieSeen(movieId);
    return { hasSeen };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/movies/:movieId/watched')
  async markAsWatched(@Param('id') userId: string, @Param('movieId') movieId: string) {
    await this.usersService.markMovieAsWatched(userId, movieId);
    return { message: 'Movie marked as watched' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/movies/:movieId/liked')
  async markAsLiked(@Param('id') userId: string, @Param('movieId') movieId: string) {
    await this.usersService.markMovieAsLiked(userId, movieId);
    return { message: 'Movie marked as liked' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/movies/:movieId/liked')
  async markMovieAsLiked(
    @Param('id') userId: string,
    @Param('movieId') movieId: string,
  ) {
    return this.usersService.toggleLikedMovie(userId, movieId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/movies/:movieId/watched')
  async markMovieAsWatched(
    @Param('id') userId: string,
    @Param('movieId') movieId: string,
  ) {
    return this.usersService.toggleWatchedMovie(userId, movieId);
  }
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  async register(@Body() userDto: any) {
    const user = await this.usersService.register(userDto);
    const token = await this.usersService.generateJwtToken({ id: user._id.toString(), username: user.username });
    return { user, token };
  }

  @Post('login')
  async login(@Body() credentials: { username: string; password: string }) {
    const { username, password } = credentials;
    const token = await this.usersService.validateUser(username, password);
    if (!token) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return { token };
  }
}