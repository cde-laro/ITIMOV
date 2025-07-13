import { Controller, Get, Post, Body, Param, Query, UnauthorizedException, Req, UseGuards, Patch } from '@nestjs/common';
import { Movie } from './movie.schema';
import { MovieService } from './movie.service';
import { UsersService } from '../users/user.service';
import { JwtAuthGuard } from '../middleware/jwt.middleware';
import { Types } from 'mongoose';
import { User } from '../users/user.schema';

@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMovies(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('liked') liked?: boolean,
    @Query('watched') watched?: boolean,
    @Query('sortField') sortField?: 'year' | 'user_note',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const userId = this.userService.decodeToken(token);
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const sort = sortField && sortOrder ? { field: sortField, order: sortOrder } : undefined;
    console.log('sort:', sort);
    return this.movieService.findAllWithUserStatus(userId, page, limit, { liked, watched }, sort);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const movieId = new Types.ObjectId(id);
    return this.movieService.findById(movieId.toString());
  }

  @Post()
  async create(@Body() createMovieDto: Partial<Movie>) {
    return this.movieService.create(createMovieDto);
  }

  @Patch(':id/like')
  @UseGuards(JwtAuthGuard)
  async likeMovie(@Param('id') id: string, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const userId = this.userService.decodeToken(token);
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.movieService.likeMovie(id, userId);
  }

  @Patch(':id/watch')
  @UseGuards(JwtAuthGuard)
  async watchMovie(@Param('id') id: string, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const userId = this.userService.decodeToken(token);
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.movieService.watchMovie(id, userId);
  }
}