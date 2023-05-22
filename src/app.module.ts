import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtAuthGuard } from './guard/jwt.guard';
import { TasksService } from './utils/task.service';
import { GoogleStrategy } from './strategies/google-oauth.strategy';
import { PostModule } from './post/post.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    PrismaModule,
    UserModule,
    AuthModule,
    RoomModule,
    UserModule,
    PostModule,
    MessageModule,
  ],

  controllers: [AppController],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    AppService,
    Logger,
    TasksService,
    GoogleStrategy,
  ],
})
export class AppModule {}
