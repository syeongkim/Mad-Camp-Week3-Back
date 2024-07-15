import * as moment from 'moment';
import * as ghrepos from 'ghrepos';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { Record } from './record.schema';
import { UserItemService } from '../useritem/useritem.service';
import { Axios, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class RecordService {

  private readonly devAccessToken: string;

  constructor(
    @InjectModel(Record.name) private recordModel: Model<Record>,
    private readonly userItemService: UserItemService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.devAccessToken = this.configService.get<string>('GITHUB_ACCESS_TOKEN');
  }

  async createRecord(recordData: Partial<Record>): Promise<Record> {
    const newRecord = new this.recordModel(recordData);
    return newRecord.save();
  }

  async updateHasCommit(username: string): Promise<void> {
    const authOptions = {
      headers: {
        Authorization: `Bearer ${this.devAccessToken}`,
      },
    };

    const today = moment().startOf('day');
    let hasCommitToday = false;

    const repos: AxiosResponse = await lastValueFrom(
      this.httpService.get(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Authorization: `Bearer ${this.devAccessToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })
    )

    for (const repo of repos.data) {
      const commits: AxiosResponse = await lastValueFrom(
        this.httpService.get(`https://api.github.com/repos/${username}/${repo.name}/commits`, {
          headers: {
            Authorization: `Bearer ${this.devAccessToken}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }),
      );

      for (const commit of commits.data) {
        const commitDate = moment(commit.commit.author.date);
        if (commitDate.isSame(today, 'day')) {
          hasCommitToday = true;
          break;
        }
      }
      if (hasCommitToday) {
        break;
      }
    }

    await this.recordModel.findOneAndUpdate({ username }, { hasCommit: hasCommitToday }, { new: true }).exec();
  }

  async updateWearingItems(username: string): Promise<void> {
    const currentWearingItems = await this.userItemService.getCurrentWearingItems(username);
    await this.recordModel.findOneAndUpdate({ username }, { wearing_items: currentWearingItems }, { new: true }).exec();
  }

  // async getRecords(): Promise<Record[]> {
  //   const records = await this.recordModel.find().exec();
  //   for (const record of records) {
  //     await this.updateHasCommit(record.username);
  //     await this.updateWearingItems(record.username);
  //   }
  //   return this.recordModel.find().exec(); // 업데이트 후 다시 조회
  // }

  async getRecordByUsername(username: string): Promise<Record> {
    await this.updateWearingItems(username);
    return this.recordModel.findOne({ username }).exec();
  }

  async updateRecord(username: string, updateData: Partial<Record>): Promise<Record> {
    return this.recordModel.findOneAndUpdate({ username }, updateData, { new: true }).exec();
  }

  async deleteRecord(username: string): Promise<Record> {
    return this.recordModel.findOneAndDelete({ username }).exec();
  }
}
