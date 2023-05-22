import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateForgotPasswordKeyDto {
  @IsNotEmpty()
  @IsString()
  readonly email: string;
}
