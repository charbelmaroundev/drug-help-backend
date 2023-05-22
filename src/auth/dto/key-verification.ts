import { IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationDto {
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
