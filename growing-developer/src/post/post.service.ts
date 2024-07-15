import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}

  async createPost(postData: Partial<Post>): Promise<Post> {
    const newPost = new this.postModel(postData);
    return newPost.save();
  }

  async findReceivedPosts(username: string): Promise<Post[]> {
    return this.postModel.find({ receiver: username }).exec();
  }

  async findSentPosts(username: string): Promise<Post[]> {
    return this.postModel.find({ sender: username }).exec();
  }
}
