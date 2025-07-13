import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { Movie, MovieSchema } from './movie.schema';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ITINOV-cde-laro',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MoviesModule {}