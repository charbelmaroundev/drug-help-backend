import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { GoogleStrategy } from '../strategies/google-oauth.strategy';
import { FacebookStrategy } from '../strategies/facebook.strategy';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailerService } from '../utils/send-email';
import { RoomService } from '../room/room.service';

@Module({
  imports: [
    UserModule,

    PassportModule,
    PrismaModule,

    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    RoomService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    FacebookStrategy,
    MailerService,
  ],

  exports: [AuthService],
})
export class AuthModule {}
