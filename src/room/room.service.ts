import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import { UserService } from '../user/user.service';

@Injectable()
export class RoomService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async create(user1Id, user2Id) {
    const checkRoom = await this.prisma.room.findFirst({
      where: {
        AND: [
          { participants: { some: { id: user1Id } } },
          { participants: { some: { id: user2Id } } },
        ],
      },
    });

    if (checkRoom) {
      return checkRoom;
    }

    return this.prisma.room.create({
      data: {
        participants: {
          connect: [{ id: user1Id }, { id: user2Id }],
        },
      },
    });
  }

  async findAll(user) {
    const { id } = user;

    return this.prisma.user.findMany({
      where: {
        id,
      },

      select: {
        rooms: {
          select: {
            id: true,
            updatedAt: true,
            messages: true,
            participants: {
              where: {
                NOT: {
                  id,
                },
              },
            },
          },
        },
      },
    });
  }

  findOne(user, roomId: number) {
    const { id } = user;

    return this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        participants: {
          where: {
            NOT: {
              id,
            },
          },
        },
        updatedAt: true,
        messages: true,
      },
    });
  }

  findAllAdminRooms() {
    return this.prisma.room.findMany({
      where: {
        participants: {
          some: {
            id: 0,
          },
        },
      },

      select: {
        messages: true,
        participants: {
          where: {
            NOT: {
              id: 0,
            },
          },
        },
      },
    });
  }
}
