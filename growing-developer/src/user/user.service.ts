import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findUserByUserName(userData: { username: string }): Promise<User> {
    const user = await this.userModel.findOne({ username: userData.username });
    return user;
  }

  async createUser(userData: { username: string; profile: string, access_token: string }): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }
  
  async createOrUpdateUser(userData: { username: string; profile: string }): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { username: userData.username },
      { profile: userData.profile },
      { new: true, upsert: true }
    );

    return user;
  }
}