import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EUserStatus, ERole } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { hashData } from '../utils/hash-data.util';
import { SignUpDto } from '../auth/dto/signup.dto';
import { EBanUnBan, EGrade, IUser } from '../types/user.type';
import { RoomService } from '../room/room.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,

    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
  ) {}

  //* CREATE USER
  async create(createUserDto: SignUpDto, status?: EUserStatus) {
    console.log(createUserDto);

    let {
      firstName,
      lastName,
      email,
      password,
      provider,
      picture,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password?: string;
      provider?: string;
      picture?: string;
    } = createUserDto;

    let hashedPassword: string;

    if (password) {
      hashedPassword = await hashData(password);
    }

    firstName = firstName.toLowerCase().trim();
    lastName = lastName.toLowerCase().trim();
    email = email.toLowerCase().trim();

    const createdUser = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        provider,
        status,
        picture,
      },
    });

    return createdUser;
  }

  //* VALIDATE USER
  async validateUser(email: string, password: string) {
    const checkEmail = await this.findOneByEmail(email);

    if (!checkEmail) {
      this.CredentialIncorrect();
    }

    // if (checkEmail.status === EUserStatus.PROVIDED) {
    //   return checkEmail;
    // }

    const message =
      checkEmail.status === EUserStatus.PROVIDED
        ? `Please Sign In with ${checkEmail.provider}!`
        : checkEmail.status === EUserStatus.UNVERIFIED
        ? `Your Account is ${checkEmail.status.toLowerCase()} Check your email!`
        : `Your Account is ${checkEmail.status.toLowerCase()}!`;
    if (checkEmail.status !== EUserStatus.VERIFIED)
      throw new HttpException(message, HttpStatus.FORBIDDEN);

    const isMatch: boolean = await bcrypt?.compare(
      password,
      checkEmail?.password,
    );

    if (!isMatch) {
      this.CredentialIncorrect();
    }

    return checkEmail;
  }

  //* CHANGE PASSWORD
  async changePassword(user, body) {
    const { oldPassword, newPassword } = body;
    const { id } = user;

    const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) throw new ForbiddenException('Incorrect Credentials!');

    const hashedNewPassword: string = await hashData(newPassword);

    await this.update({ id: id }, { password: hashedNewPassword });

    return { message: 'Your password changed successfully!' };
  }

  //* DELETE ACCOUNT
  async deleteAccount(user: IUser, body) {
    const { password } = body;
    const { id } = user;

    const checkUser = await this.findOneById(id);

    const isMatch: boolean = await bcrypt?.compare(
      password,
      checkUser?.password,
    );

    if (!isMatch) throw new ForbiddenException('Incorrect Password!');

    await this.update(
      {
        id,
      },

      {
        status: EUserStatus.DELETED,
      },
    );
  }

  //* UNLINK ACCOUNT
  async unLinkAccount(user: IUser, body) {
    const { id } = user;
    const { password } = body;

    const hashedPassword = await hashData(password);

    await this.update(
      {
        id,
      },

      {
        password: hashedPassword,
        status: EUserStatus.VERIFIED,
      },
    );

    return { message: 'Your account is Unlinked!' };
  }

  //* BAN/UNBAN ACCOUNT AND UP/DOWN GRADE ACCOUNT
  async banUnbanUpDownGradeAccount(param) {
    const { id, method } = param;

    const user = await this.findOneById(id);

    if (method === EBanUnBan.BAN || method === EBanUnBan.UNBAN) {
      if (
        (user.status === 'BANNED' && method === EBanUnBan.BAN) ||
        (user.status === 'VERIFIED' && method === EBanUnBan.UNBAN)
      ) {
        return { message: `This account is already ${method}ned!` };
      }

      if (method === EBanUnBan.BAN) {
        await this.update(
          {
            id: +id,
          },

          {
            status: EUserStatus.BANNED,
          },
        );
      }

      if (method === EBanUnBan.UNBAN) {
        if (user.provider) {
          await this.update(
            {
              id: +id,
            },

            {
              status: EUserStatus.PROVIDED,
            },
          );
        } else {
          await this.update(
            {
              id: +id,
            },

            {
              status: EUserStatus.VERIFIED,
            },
          );
        }
      }

      return { message: `This account is ${method}ned!` };
    }

    if (method === EGrade.UPGRADE || method === EGrade.DOWNGRADE) {
      if (
        (user.role === 'BUSINESS' && method === EGrade.UPGRADE) ||
        (user.role === 'CLIENT' && method === EGrade.DOWNGRADE)
      ) {
        return {
          message: `This account is already a ${user.role.toLowerCase()} account!`,
        };
      }
      if (method === EGrade.UPGRADE) {
        await this.update(
          {
            id: +id,
          },
          {
            role: ERole.BUSINESS,
          },
        );
      }
      if (method === EGrade.DOWNGRADE) {
        await this.update(
          {
            id: +id,
          },
          {
            role: ERole.CLIENT,
          },
        );
      }
      return { message: `This account is ${method}d!` };
    }
  }

  //* REQUEST BUSINESS ACCOUNT
  requestBusinessAccount(user: IUser) {
    //SEND AN EMAIL TO ADMIN
    console.log('Your request ');
  }

  CredentialIncorrect() {
    throw new ForbiddenException('Incorrect Credentials!');
  }

  //* FIND ONE BY EMAIL
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  //* FIND ONE BY ID
  async findOneById(id: number) {
    const checkUser = await this.prisma.user.findUnique({
      where: {
        id: +id,
      },
    });

    if (!checkUser)
      throw new NotFoundException(`Account with this id ${id} not found!`);

    return checkUser;
  }

  //* REMOVE ONE BY EMAIL
  async removeOneByEmail(email: string) {
    await this.prisma.user.delete({
      where: {
        email,
      },
    });
  }

  //* UPDATE ONE BY ID
  async update(checkBy: any, update: Object) {
    await this.prisma.user.update({
      where: checkBy,

      data: update,
    });
  }

  //* REMOVE ONE BY ID
  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });
  }

  //* UPDATE PICTURE
  async updateUser(user: IUser, body) {
    const { firstName, lastName, picture } = body;

    await this.update(
      {
        id: user.id,
      },

      {
        firstName,
        lastName,
        picture,
      },
    );

    return { message: 'Your profile was updated!' };
  }

  async createdUserByMonth() {
    const users = await this.prisma.user.groupBy({
      by: ['createdAt'],
    });

    const usersArr = users.map((user) => {
      return new Date(user.createdAt).getMonth() + 1;
    });

    function countMonths(numbers) {
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
    }

    return countMonths(usersArr);
  }

  //* DELETE UNVERIFIED ACCOUNTS
  async deleteUnVerifiedAccounts() {
    await this.prisma.user.deleteMany({
      where: {
        status: EUserStatus.UNVERIFIED,
        createdAt: {
          lte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      where: {
        role: 'CLIENT',
      },
    });
  }
}
