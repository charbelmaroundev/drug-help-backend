import { Module, forwardRef } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [PrismaModule, RoomModule],

  controllers: [UserController],

  providers: [UserService],

  exports: [UserService],
})
export class UserModule {}
