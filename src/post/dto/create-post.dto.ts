import { EPostStatus, ELebanonCity } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsEnum(EPostStatus)
  @IsOptional()
  status: EPostStatus;

  @IsInt()
  @IsPositive()
  @IsOptional()
  priceInDollar: number;

  @IsEnum(ELebanonCity)
  @IsOptional()
  location: ELebanonCity;
}
