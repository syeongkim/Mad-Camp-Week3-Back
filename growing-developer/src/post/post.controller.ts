import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './post.schema';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiBody({ type: PostModel })
  async createPost(@Body() postData: Partial<PostModel>): Promise<PostModel> {
    return this.postService.createPost(postData);
  }

  @Get('received/:username')
  async getReceivedPosts(@Param('username') username: string): Promise<PostModel[]> {
    return this.postService.findReceivedPosts(username);
  }

  @Get('sent/:username')
  async getSentPosts(@Param('username') username: string): Promise<PostModel[]> {
    return this.postService.findSentPosts(username);
  }
}
