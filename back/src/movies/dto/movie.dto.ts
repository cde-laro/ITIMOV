import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class MovieDto {
  @Transform(({ value }: { value: string }) => new Types.ObjectId(value))
  id!: Types.ObjectId;

  title!: string;
}
