import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import { UserService } from '../user/user.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  createMessage(data) {
    const { user: creatorId, room: roomId, message: content } = data;

    return this.prisma.message.create({
      data: {
        creatorId,
        content,
        roomId: +roomId,
      },
    });
  }
}
