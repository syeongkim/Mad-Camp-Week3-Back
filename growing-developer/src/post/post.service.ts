import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { UserPost } from './userpost.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(UserPost.name) private readonly userPostModel: Model<UserPost>,
  ) {}

  async getSentPosts(username: string): Promise<Post[]> {
    return this.postModel
      .find({ sender: username })
      .sort({ created_at: -1 })
      .exec();
  }

  async getReceivedPosts(username: string): Promise<Post[]> {
    return this.postModel
      .find({ receiver: username })
      .sort({ created_at: -1 })
      .exec();
  }

  // 예제 메서드: 새로운 쪽지 생성
  async createPost(postData: Partial<Post>): Promise<Post> {
    const newPost = new this.postModel(postData);
    return newPost.save();
  }
}
