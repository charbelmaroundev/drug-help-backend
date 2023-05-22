import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EUserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { SignUpDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { generateKey } from '../utils/generate-key.util';
import { IUser } from '../types/user.type';
import { EmailVerificationDto } from './dto/key-verification';
import { hashData } from '../utils/hash-data.util';
import { resetPasswordHtml } from '../utils/reset-password-html.util';
import { EmailVerificationHtml } from '../utils/email-verification-html.util';
import { deleteRedis, setRedis, getRedis } from '../utils/store-redis.util';
import { MailerService } from '../utils/send-email';
import { RoomService } from '../room/room.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private roomService: RoomService,
    private mailerService: MailerService,
  ) {}

  //* SIGN UP
  async signUp(body: SignUpDto) {
    const { email }: { email: string } = body;
    const checkEmail = await this.userService.findOneByEmail(email);

    if (checkEmail)
      throw new ConflictException(
        `User with this email '${email.toLowerCase()}' is already exist!`,
      );

    const key: string = await generateKey();
    const hashedKey: string = await hashData(key);

    setRedis(email, hashedKey);

    const user: any = await this.userService.create(body);
    const { id } = user;

    const token: string = this.jwtService.sign(
      {
        id,
        email,
        key,
      },

      {
        expiresIn: process.env.JWT_KEY_TOKEN_EXPIRES_IN,
      },
    );

    this.mailerService.sendMail(
      user.email,
      'Email Verification',
      EmailVerificationHtml(
        body.firstName,
        token,
        process.env.EMAIL_VERIFICATION_URL,
      ),
    );

    return {
      message: `Check your email '${user.email}' in order to verify your account!`,
    };
  }

  //* EMAIL VERIFICATION
  async emailVerification(body: EmailVerificationDto) {
    const { token } = body;
    const checkToken = await this.checkToken(token);

    if (checkToken.message !== 'jwt valid') return checkToken;

    const { id, email, key }: any = await this.jwtService.decode(token);
    const checkEmail = await this.userService.findOneByEmail(email);

    if (checkEmail.status === EUserStatus.VERIFIED)
      throw new ConflictException('Account is verified!');

    const storedKey = await getRedis(email);

    if (!storedKey) throw new NotFoundException('Key expired!');

    const isMatch: boolean = await bcrypt.compare(key, storedKey);
    if (!isMatch) return { message: 'Incorrect Key' };

    await deleteRedis(email);

    this.userService.update(
      {
        id,
      },

      {
        status: EUserStatus.VERIFIED,
      },
    );

    this.roomService.create(0, id);

    return { message: 'Correct Key!' };
  }

  //* SIGN IN
  async signIn(user: IUser | any) {
    const message =
      user.status === EUserStatus.PROVIDED
        ? `Please Sign In with ${user.provider}!`
        : user.status === EUserStatus.UNVERIFIED
        ? `Your Account is ${user.status.toLowerCase()} Check your email!`
        : `Your Account is ${user.status.toLowerCase()}!`;
    if (user.status !== EUserStatus.VERIFIED)
      throw new HttpException(message, HttpStatus.FORBIDDEN);

    return this.generateAccessToken(user);
  }

  //* GENERATE ACCESS TOKEN
  generateAccessToken(user: IUser) {
    const { id } = user;

    const access_token = this.jwtService.sign({ id });

    return { access_token };
  }

  //* CHECK TOKEN
  async checkToken(token: string) {
    try {
      const { exp } = await this.jwtService.verify(token);
      return {
        message: 'jwt valid',
        expiredAt: new Date(exp * 1000).toLocaleString(),
      };
    } catch (error) {
      throw new HttpException('error', 400, { cause: new Error('hahahha') });
    }
  }

  //* SEND FORGOT PASSWORD
  async generateForgotPassword(body) {
    const {
      email,
    }: {
      email: string;
    } = body;

    const checkEmail = await this.userService.findOneByEmail(email);

    if (!checkEmail)
      throw new ConflictException(
        `This email '${email.toLowerCase()}' is not found!`,
      );

    const {
      id,
    }: {
      id: number;
    } = checkEmail;

    const token: string = this.jwtService.sign(
      {
        id,
        email,
      },

      {
        expiresIn: process.env.JWT_KEY_TOKEN_EXPIRES_IN,
      },
    );

    this.mailerService.sendMail(
      email,
      'Reset Password',
      resetPasswordHtml(
        checkEmail.firstName,
        token,
        process.env.FORGOT_PASSWORD_URL,
      ),
    );

    return { message: 'Check your email in order to reset your password!' };
  }

  //* RESET PASSWORD
  async resetPassword(body) {
    const {
      email,
      token,
      newPassword,
    }: {
      email: string;
      token: string;
      newPassword: string;
    } = body;

    const validateToken = await this.checkToken(token);

    if (validateToken.message !== 'jwt valid') return validateToken;

    const decodedToken = await this.jwtService.decode(token);

    if (decodedToken['email'] !== email)
      throw new NotFoundException('Something went wrong!');

    const newHashedPassword: string = await hashData(newPassword);

    await this.userService.update(
      {
        id: decodedToken['id'],
      },

      {
        password: newHashedPassword,
      },
    );

    return {
      message: 'Password reset successfully! sign in with your new password!',
    };
  }

  //* SIGN IN/SIGN UP WITH GOOGLE
  async googleLoginRedirect(body) {
    return this.OAuthLogin(body);
  }

  //* SIGN IN/SIGN UP WITH FACEBOOK
  async facebookLoginRedirect(body) {
    return this.OAuthLogin(body);
  }

  //* OAUTH
  async OAuthLogin(body: any) {
    const { email, firstName, lastName, picture, provider } = body;

    if (!body) return { message: `No user from ${provider}!` };

    const checkUser: IUser = await this.userService.findOneByEmail(email);

    if (checkUser) {
      if (
        checkUser.status === EUserStatus.BANNED ||
        checkUser.status === EUserStatus.DELETED
      )
        throw new HttpException(
          `Your Account is ${checkUser.status.toLowerCase()} you cannot access it!`,
          HttpStatus.FORBIDDEN,
        );

      await this.userService.update(
        { id: checkUser.id },
        { provider: body.provider },
      );

      return this.generateAccessToken(checkUser);
    }

    const newUser: IUser = await this.userService.create(
      body,
      EUserStatus.PROVIDED,
    );

    this.roomService.create(0, newUser.id);

    return this.generateAccessToken(newUser);
  }
}
