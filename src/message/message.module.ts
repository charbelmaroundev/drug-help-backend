import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';

import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],

  providers: [MessageGateway, MessageService],
})
export class MessageModule {}
