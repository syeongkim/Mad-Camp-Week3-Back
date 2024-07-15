//import { Controller, Get, Param, Post, Body } from '@nestjs/common';
//import { ApiBody, ApiParam, ApiTags, ApiResponse } from '@nestjs/swagger';

//import { UserPostService } from './userpost.service';
//import { Post as PostModel } from './post.schema';

//@ApiTags('posts')
//@Controller('posts')
//export class PostController {
//  constructor(private readonly postService: UserPostService) {}

//  @Get('sent/:username')
//  async getSentPosts(@Param('username') username: string): Promise<PostModel[]> {
//    return this.postService.getSentPosts(username);
//  }

//  @Get('received/:username')
//  async getReceivedPosts(@Param('username') username: string): Promise<PostModel[]> {
//    return this.postService.getReceivedPosts(username);
//  }

//  @Post()
//  @ApiBody({ type: PostModel })
//  async createPost(@Body() postData: Partial<PostModel>): Promise<PostModel> {
//    return this.postService.createPost(postData);
//  }
//}
