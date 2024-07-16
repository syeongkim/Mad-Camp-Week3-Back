import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTil } from './usertil.schema';
import { Til } from './til.schema';
import * as moment from 'moment';

@Injectable()
export class UserTilService {
  constructor(@InjectModel(UserTil.name) private readonly userTilModel: Model<UserTil>) {}

  async createUserTil(username: string): Promise<UserTil> {
    const newUserTil = new this.userTilModel({ username, til: [] });
    return newUserTil.save();
  }

  async findUserTilByUsername(username: string): Promise<UserTil> {
    const userTil = await this.userTilModel.findOne({ username }).exec();
    if (!userTil) {
      throw new NotFoundException('User TIL not found');
    }
    return userTil;
  }

  async addTil(username: string, tilData: Til): Promise<UserTil> {
    const userTil = await this.findUserTilByUsername(username);
    userTil.til.push(tilData);
    return userTil.save();
  }

  async updateTil(username: string, tilId: number, tilData: Partial<Til>): Promise<UserTil> {
    const userTil = await this.findUserTilByUsername(username);
    const tilIndex = userTil.til.findIndex(t => t.id == tilId);
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

  async getConsistentTilUsers(days: number): Promise<string[]> {
    const startDate = moment().subtract(days, 'days').startOf('day');
    const today = moment().endOf('day');

    const users = await this.userTilModel.find().exec();
    const consistentUsers: string[] = [];

    for (const user of users) {
      const tils = user.til.filter(til => {
        const createdAt = moment(til['createdAt']);
        return createdAt.isBetween(startDate, today, null, '[]');
      }).sort((a, b) => (a['createdAt'] > b['createdAt'] ? 1 : -1));

      if (tils.length >= days) {
        let isConsistent = true;
        for (let i = 0; i < tils.length - (days - 1); i++) {
          let consecutive = true;
          for (let j = 1; j < days; j++) {
            const day1 = moment(tils[i]['createdAt']).startOf('day');
            const day2 = moment(tils[i + j]['createdAt']).startOf('day');
            if (!day1.add(j, 'days').isSame(day2)) {
              consecutive = false;
              break;
            }
          }
          if (consecutive) {
            isConsistent = true;
            break;
          }
        }
        if (isConsistent) {
          consistentUsers.push(user.username);
        }
      }
    }

    return consistentUsers;
  }
}
