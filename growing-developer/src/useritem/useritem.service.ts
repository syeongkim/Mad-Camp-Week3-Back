import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserItem } from './useritem.schema';
import { Item } from './item.schema';

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

  // async updateUserItems(username: string, items: Partial<UserItem['items']>): Promise<UserItem> {
  //   return this.userItemModel.findOneAndUpdate({ username }, { items }, { new: true }).exec();
  // }

  async addUserItem(username: string, itemData: Item): Promise<UserItem> {
    const userItem = await this.userItemModel.findOne({ username }).exec();
    if (!userItem) {
      throw new NotFoundException('User not found');
    }

    userItem.items.push(itemData);
    return userItem.save();
  }

  async updateUserItem(username: string, itemData: Item): Promise<UserItem> {
    const userItem = await this.userItemModel.findOne({ username }).exec();
    if (!userItem) {
      throw new NotFoundException('User not found');
    }

    const itemIndex = userItem.items.findIndex(item => item.name === itemData.name);
    if (itemIndex === -1) {
      throw new NotFoundException('Item not found');
    }

    const existingItem = userItem.items[itemIndex];
    if (itemData.stocks != undefined) {
      existingItem.stocks += itemData.stocks;
    }
    if (itemData.current != undefined) {
      existingItem.current = itemData.current;
    }

    userItem.items[itemIndex] = existingItem;
    return userItem.save();
  }

  async getCurrentWearingItems(username: string): Promise<string[]> {
    const userItem = await this.userItemModel.findOne({ username }).exec();
    if (!userItem) {
      return [];
    }
    return userItem.items.filter(item => item.current).map(item => item.name);
  }
  
  async getAllUserItems(): Promise<UserItem[]> {
    return this.userItemModel.find().exec();
  }
}
