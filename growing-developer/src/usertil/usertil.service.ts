import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTil } from './usertil.schema';
import { Til } from './til.schema';

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
    existingTil.date = tilData.date;
    if (tilData.contents != undefined) {
      existingTil.contents = tilData.contents;
    }
    if (tilData.images != undefined) {
      existingTil.images = tilData.images;
    }
    userTil.til[tilIndex] = existingTil;
    return userTil.save();
  }

  async deleteTil(username: string, tilId: number): Promise<UserTil> {
    const userTil = await this.findUserTilByUsername(username);
    const tilIndex = userTil.til.findIndex(t => t.id == tilId);
    if (tilIndex === -1) {
      throw new NotFoundException('TIL not found');
    }
    userTil.til.splice(tilIndex, 1);
    return userTil.save();
  }
}
