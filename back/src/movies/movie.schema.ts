import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  director!: string;

  @Prop({ required: true })
  year!: number;

  @Prop({ required: true })
  duration!: number;

  @Prop()
  poster_url?: string;

  @Prop()
  user_note?: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);