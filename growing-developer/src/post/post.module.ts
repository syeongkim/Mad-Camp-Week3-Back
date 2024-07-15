import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, PostSchema } from './post.schema';
import { UserPost, UserPostSchema } from './userpost.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: UserPost.name, schema: UserPostSchema }]),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
