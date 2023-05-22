import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { RoomService } from './room.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { IUser } from '../types/user.type';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@CurrentUser() user: IUser, @Body() body) {
    return this.roomService.create(user.id, body.id);
  }

  @Get()
  findAll(@CurrentUser() user) {
    return this.roomService.findAll(user);
  }

  @Get('admin')
  findAllAdminRooms() {
    return this.roomService.findAllAdminRooms();
  }

  @Get(':id')
  findOne(@CurrentUser() user, @Param('id') id: string) {
    return this.roomService.findOne(user, +id);
  }
}
