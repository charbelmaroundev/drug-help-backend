import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { EUserStatus } from '@prisma/client';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_REDIRECT_URL,
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { name, emails, provider } = profile;
    const { givenName, familyName } = name;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    const payload = {
      user,
      accessToken,
    };

    return {
      firstName: givenName,
      lastName: familyName,
      email: emails[0].value,
      picture: '',
      provider,
      status: EUserStatus.PROVIDED,
    };
  }
}
