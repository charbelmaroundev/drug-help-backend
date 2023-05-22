import { IsString, Matches } from 'class-validator';

export class UnlinkAccountDto {
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password should be at least 8 characters contain at least one uppercase character, one lowercase character, one number and one special character',
  })
  readonly password: string;
}
