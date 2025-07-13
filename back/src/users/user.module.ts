import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController, AuthController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UsersService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ITINOV-cde-laro',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}