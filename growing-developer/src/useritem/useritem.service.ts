import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserItem } from './useritem.schema';
import { Item } from './item.schema';
import { PostService } from '../post/post.service';

@Injectable()
export class UserItemService {
  constructor(@InjectModel(UserItem.name) private readonly userItemModel: Model<UserItem>,
  private readonly postService: PostService
) { }

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

    const itemIndex = userItem.items.findIndex(item => item.name === itemData.name);
    if (itemIndex === -1) {
      userItem.items.push(itemData);
    } else {
      const existingItem = userItem.items[itemIndex];
      if (itemData.stocks != undefined) {
        existingItem.stocks += itemData.stocks;
      }
      if (itemData.current != undefined) {
        existingItem.current = itemData.current;
      }
      userItem.items[itemIndex] = existingItem;
    }
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

  async sendGift(senderUsername: string, receiverUsername: string, itemName: string): Promise<{ sender: UserItem, receiver: UserItem }> {
    const sender = await this.userItemModel.findOne({ username: senderUsername }).exec();
    const receiver = await this.userItemModel.findOne({ username: receiverUsername }).exec();

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    const itemIndex = sender.items.findIndex(item => item.name === itemName);
    if (itemIndex === -1) {
      throw new BadRequestException('Item not found in sender\'s item list');
    }

    const itemToSend = sender.items[itemIndex];

    // Remove item from sender's list
    if (itemToSend.stocks === 1) {
      sender.items.splice(itemIndex, 1);
    } else {
      sender.items[itemIndex].stocks -= 1;
    }

    // Add item to receiver's list
    const receiverItemIndex = receiver.items.findIndex(item => item.name === itemName);
    if (receiverItemIndex === -1) {
      receiver.items.push({ "name": itemName, "stocks": 1, "current": false } as Item);
    } else {
      receiver.items[receiverItemIndex].stocks += 1;
    }

    await sender.save();
    await receiver.save();

    await this.postService.createPost({
      sender: senderUsername,
      receiver: receiverUsername,
      contents: `선물이 도착했어요! \n ${senderUsername}님이 ${receiverUsername}님에게 ${itemName}을 선물했어요!`
    });

    return { sender, receiver };
  }
}
