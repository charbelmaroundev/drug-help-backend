import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';

import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, forwardRef(() => UserModule)],

  controllers: [RoomController],

  providers: [RoomService],

  exports: [RoomService],
})
export class RoomModule {}
