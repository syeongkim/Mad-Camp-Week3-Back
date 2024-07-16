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
    return this.postModel.find({ receiver: username }).exec();
  }

  async findSentPosts(username: string): Promise<Post[]> {
    return this.postModel.find({ sender: username }).exec();
  }

  async getTopSenderOfMonth(): Promise<string> {
    const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
    const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toDate();

    const temp = this.postModel.find({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } })
    console.log(temp);
    const result = await this.postModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
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
    return result.length > 0 ? result[0]._id : null;
  }
}
