import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { Post } from './post.schema';
import { start } from 'repl';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}

  async createPost(postData: Partial<Post>): Promise<Post> {
    const newPost = new this.postModel(postData);
    return newPost.save();
  }

  async findReceivedPosts(username: string): Promise<Post[]> {
    return (await this.postModel.find({ receiver: username }).exec()).sort((a, b) => b['createdAt'].getTime() - a['createdAt'].getTime());
  }

  async findSentPosts(username: string): Promise<Post[]> {
    return (await this.postModel.find({ sender: username }).exec()).sort((a, b) => b['createdAt'].getTime() - a['createdAt'].getTime());
  }

  async getTopSenderOfWeek(): Promise<{ username: string, count: number } | null> {
    const startOfLastWeek = moment().subtract(1, 'week').startOf('week').toDate();
    const endOfLastWeek = moment().subtract(1, 'week').endOf('week').toDate();
  
    const result = await this.postModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
        },
      },
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]);
  
    console.log(result);
    return result.length > 0 ? { username: result[0]._id, count: result[0].count } : null;
  }
}
