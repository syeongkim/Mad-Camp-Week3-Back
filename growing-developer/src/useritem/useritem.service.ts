import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserItem } from './useritem.schema';

@Injectable()
export class UserItemService {
  constructor(@InjectModel(UserItem.name) private readonly userItemModel: Model<UserItem>) {}

  async createUserItem(userItemData: Partial<UserItem>): Promise<UserItem> {
    const newUserItem = new this.userItemModel(userItemData);
    return newUserItem.save();
  }

  async findUserItemByUsername(username: string): Promise<UserItem> {
    return this.userItemModel.findOne({ username }).exec();
  }

  async updateUserItems(username: string, items: Partial<UserItem['items']>): Promise<UserItem> {
    return this.userItemModel.findOneAndUpdate({ username }, { items }, { new: true }).exec();
  }

  async getAllUserItems(): Promise<UserItem[]> {
    return this.userItemModel.find().exec();
  }
}
