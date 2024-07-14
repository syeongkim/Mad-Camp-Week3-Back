import * as moment from 'moment';
import * as ghrepos from 'ghrepos';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Record } from './record.schema';
import { UserItemService } from '../useritem/useritem.service';


@Injectable()
export class RecordService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<Record>,
    private readonly userItemService: UserItemService,
  ) { }

  async createRecord(recordData: Partial<Record>): Promise<Record> {
    const newRecord = new this.recordModel(recordData);
    return newRecord.save();
  }

  async updateHasCommit(username: string, authOptions: any): Promise<void> {
    const today = moment().startOf('day');
    let hasCommitToday = false;

    await new Promise((resolve, reject) => {
      ghrepos.listUser(authOptions, username, (err, repolist) => {
        if (err) {
          return reject(err);
        }
        let processedRepos = 0;

        repolist.forEach((repo) => {
          ghrepos.listCommits(authOptions, username, repo.name, (err, refData) => {
            if (err) {
              return reject(err);
            }

            refData.forEach((ref) => {
              const commitDate = moment(ref.commit.author.date);
              if (commitDate.isSame(today, 'day')) {
                hasCommitToday = true;
              }
            });

            processedRepos++;
            if (processedRepos === repolist.length) {
              resolve(null);
            }
          });
        });

        if (repolist.length === 0) {
          resolve(null);
        }
      });
    });

    await this.recordModel.findOneAndUpdate({ username }, { hasCommit: hasCommitToday }, { new: true }).exec();
  }

  async updateWearingItems(username: string): Promise<void> {
    const currentWearingItems = await this.userItemService.getCurrentWearingItems(username);
    await this.recordModel.findOneAndUpdate({ username }, { wearing_items: currentWearingItems }, { new: true }).exec();
  }

  async getRecords(): Promise<Record[]> {
    const records = await this.recordModel.find().exec();
    for (const record of records) {
      await this.updateWearingItems(record.username);
    }
    return this.recordModel.find().exec(); // 업데이트 후 다시 조회
  }

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
