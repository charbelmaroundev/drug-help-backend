import { IsNotEmpty, IsString } from 'class-validator';

export class CheckTokenDto {
  @IsString()
  @IsNotEmpty()
  readonly access_token: string;
}
