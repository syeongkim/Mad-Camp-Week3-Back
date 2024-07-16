import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTil } from './usertil.schema';
import { Til } from './til.schema';
import * as moment from 'moment';

@Injectable()
export class UserTilService {
  constructor(@InjectModel(UserTil.name) private readonly userTilModel: Model<UserTil>) {}

  // async createUserTil(username: string): Promise<UserTil> {
  //   const newUserTil = new this.userTilModel({ username, til: [] });
  //   return newUserTil.save();
  // }

  async createUserTil(userTilData: Partial<UserTil>): Promise<UserTil> {
    const newUserItem = new this.userTilModel(userTilData);
    return newUserItem.save();
  }

  async findUserTilByUsername(username: string): Promise<UserTil> {
    const userTil = await this.userTilModel.findOne({ username })
    // const tilList = userTil.til.sort((a, b) => b['createdAt'].getTime() - a['createdAt'].getTime());
    // userTil.til = tilList;
    if (!userTil) {
      throw new NotFoundException('User TIL not found');
    }
    return userTil;
  }

  async addTil(username: string, tilData: Til): Promise<UserTil> {
    const userTil = await this.findUserTilByUsername(username);
    userTil.til.unshift(tilData);
    return userTil.save();
  }

  async updateTil(username: string, tilId: string, tilData: Partial<Til>): Promise<UserTil> {
    const userTil = await this.findUserTilByUsername(username);
    const tilIndex = userTil.til.findIndex(t => t._id.toString() == tilId);
    if (tilIndex === -1) {
      throw new NotFoundException('TIL not found');
    }

    const existingTil = userTil.til[tilIndex];
    if (tilData.contents != undefined) {
      existingTil.contents = tilData.contents;
    }
    if (tilData.images != undefined) {
      existingTil.images = tilData.images;
    }
    userTil.til[tilIndex] = existingTil;
    return userTil.save();
  }

  async deleteTil(username: string, tilId: string): Promise<UserTil> {
    const userTil = await this.findUserTilByUsername(username);
    const tilIndex = userTil.til.findIndex(t => t._id.toString() === tilId);
    if (tilIndex === -1) {
      throw new NotFoundException('TIL not found');
    }
    userTil.til.splice(tilIndex, 1);
    return userTil.save();
  }

  async getConsistentTilUsers(days: number): Promise<{ consistentUserList: string[] }> {
    const startDate = moment().subtract(3, 'days').startOf('day');
    const today = moment().endOf('day');
    console.log(startDate, today);

    const users = await this.userTilModel.find().exec();
    const consistentUsers: string[] = [];

    for (const user of users) {
      const tils = user.til
        .filter(til => {
          const createdAt = moment(til['createdAt']).startOf('day');
          return createdAt.isBetween(startDate, today, null, '[]');
        })
        .sort((a, b) => (moment(a['createdAt']).startOf('day').isAfter(moment(b['createdAt']).startOf('day')) ? 1 : -1));

      console.log("tils: ", tils);
      if (tils.length >= days) {
        let isConsistent = true;
        for (let i = 0; i < days; i++) {
          const checkDate = moment(startDate).add(i, 'days').startOf('day');
          const existTil = tils.find(til => moment(til['createdAt']).startOf('day').isSame(checkDate));
          if (!existTil) {
            isConsistent = false;
            break;
          }
        }
        if (isConsistent) {
          consistentUsers.push(user.username);
        }
      }
    }

    return { "consistentUserList": consistentUsers };
  }
}
