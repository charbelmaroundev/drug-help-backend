import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { IUser } from '../types/user.type';
import { Public } from '../decorators/public.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@CurrentUser() user: IUser, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(user, createPostDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('my-posts')
  findAllMyPosts(@CurrentUser() user: IUser) {
    return this.postService.findAllMyPosts(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }

  @Public()
  @Get('search')
  findAllSearch() {
    return this.postService.findAll();
  }

  @Public()
  @Get('search/:term')
  search(@CurrentUser() user: IUser, @Param('term') term: string) {
    return this.postService.search(user, term);
  }

  @Public()
  @Get('location')
  locationCount() {
    return this.postService.locationCount();
  }

  @Public()
  @Get('posts-by-month')
  createdUserByMonth() {
    return this.postService.createdPostByMonth();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
}
