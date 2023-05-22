import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { IUser } from '../types/user.type';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UnlinkAccountDto } from './dto/unlink-account.dto';
import { BanUnbanUpgradeDowngradeDto } from './dto/ban-unban-upgrade-downgrade.dto';
import { Public } from '../decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //* CHECK EMAIL
  @Public()
  @Post('checkemail')
  checkEmail(@Body() body: any) {
    return this.userService.findOneByEmail(body.email);
  }

  //* WHO AM I
  @Get('whoami')
  whoAmI(@CurrentUser() user: IUser) {
    return user;
  }

  //* CHANGE PASSWORD
  @Post('changepassword')
  changePassword(@CurrentUser() user: IUser, @Body() body: ChangePasswordDto) {
    return this.userService.changePassword(user, body);
  }

  //* DELETE ACCOUNT
  @Post('deleteaccount')
  deleteAccount(@CurrentUser() user: IUser, @Body() body) {
    return this.userService.deleteAccount(user, body);
  }

  //* UNLINK ACCOUNT
  @Post('unlinkaccount')
  unLinkAccount(@CurrentUser() user: IUser, @Body() body: UnlinkAccountDto) {
    return this.userService.unLinkAccount(user, body);
  }

  //* REQUEST BUSINESS ACCOUNT
  @Get('requestbusinessaccount')
  requestBusinessAccount(@CurrentUser() user: IUser) {
    return this.userService.requestBusinessAccount(user);
  }

  //* BAN/UNBAN ACCOUNT AND UP/DOWN GRADE ACCOUNT
  @Get('account/:method/:id')
  banUnbanUpDownGradeAccount(@Param() param: BanUnbanUpgradeDowngradeDto) {
    return this.userService.banUnbanUpDownGradeAccount(param);
  }

  //* UPDATE PICTURE
  @Post()
  updateUser(@CurrentUser() user: IUser, @Body() body) {
    return this.userService.updateUser(user, body);
  }

  @Public()
  @Get('user-by-month')
  createdUserByMonth() {
    return this.userService.createdUserByMonth();
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
