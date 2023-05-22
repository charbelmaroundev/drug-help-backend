import { Injectable } from '@nestjs/common';

import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { IUser } from '../types/user.type';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  create(user: IUser, createPostDto) {
    const { id } = user;
    const { title, description, imageUrl, status, priceInDollar, location } =
      createPostDto;

    return this.prisma.post.create({
      data: {
        creatorId: id,
        title,
        description,
        imageUrl,
        status,
        priceInDollar,
        location,
      },
    });
  }

  findAll() {
    return this.prisma.post.findMany({});
  }

  findAllMyPosts(user: IUser) {
    const { id } = user;
    return this.prisma.post.findMany({
      where: {
        creator: {
          id,
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },

      include: {
        creator: true,
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },

      data: updatePostDto,
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }

  search(user: IUser, term: string) {
    // const { id } = user;

    return this.prisma.post.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: term } },
              { description: { contains: term } },
            ],
          },
        ],
      },
    });
  }

  async locationCount() {
    const locations = await this.prisma.post.groupBy({
      by: ['location'],
      _count: {
        location: true,
      },
    });

    const jsonArray = [];
    const chartLabels = [];

    locations.map((location) => {
      jsonArray.push(location._count.location);
      chartLabels.push(location.location);
    });

    return {
      jsonArray,
      chartLabels,
    };
  }

  async createdPostByMonth() {
    const posts = await this.prisma.post.groupBy({
      by: ['createdAt'],
    });

    const postsArr = posts.map((user) => {
      return new Date(user.createdAt).getMonth() + 1;
    });

    const countMonths = (numbers) => {
      const months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
      };

      const counts = {};

      // Initialize counts object with 0 for each month
      for (const month of Object.keys(months)) {
        counts[months[month]] = 0;
      }

      // Count occurrences of each month in numbers array
      for (const number of numbers) {
        const monthName = months[number];
        if (monthName) {
          counts[monthName]++;
        }
      }

      return counts;
    };

    return countMonths(postsArr);
  }
}
