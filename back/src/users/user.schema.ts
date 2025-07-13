import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  _id!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: [String], default: [] })
  seenMovies!: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Movie' }], default: [] })
  likedMovies!: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Movie', default: [] })
  watchedMovies!: Types.ObjectId[];

  isMovieSeen(movieId: string): boolean {
    return this.seenMovies?.includes(movieId) || false;
  }

  isMovieLiked(movieId: Types.ObjectId): boolean {
    return this.likedMovies?.some(id => id.equals(movieId)) || false;
  }
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);