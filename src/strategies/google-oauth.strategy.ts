import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { EUserStatus } from '@prisma/client';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { name, emails, provider, _json } = profile;
    const { picture, email_verified } = _json;
    const { familyName, givenName } = name;

    return {
      firstName: givenName,
      lastName: familyName,
      email: emails[0].value,
      picture,
      provider,
      status: EUserStatus.PROVIDED,
    };
  }
}
