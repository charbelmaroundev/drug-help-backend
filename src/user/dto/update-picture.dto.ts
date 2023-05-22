import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePictureDto {
  @IsString()
  @IsNotEmpty()
  readonly picture: string;
}
