import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from './record.schema';
import * as moment from 'moment';
import * as ghrepos from 'ghrepos';

@Injectable()
export class RecordService {
  constructor(@InjectModel(Record.name) private recordModel: Model<Record>) { }

  async createRecord(recordData: Partial<Record>): Promise<Record> {
    const newRecord = new this.recordModel(recordData);
    return newRecord.save();
  }

  async updateCommits(username: string, authOptions: any): Promise<void> {
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

    await this.recordModel.findOneAndUpdate({ username }, { commits: hasCommitToday }, { new: true }).exec();
  }
    
  async getRecords(): Promise < Record[] > {
      return this.recordModel.find().exec();
    }

  async getRecordByUsername(username: string): Promise < Record > {
      return this.recordModel.findOne({ username }).exec();
    }

  async updateRecord(username: string, updateData: Partial<Record>): Promise < Record > {
      return this.recordModel.findOneAndUpdate({ username }, updateData, { new: true }).exec();
    }

  async deleteRecord(username: string): Promise < Record > {
      return this.recordModel.findOneAndDelete({ username }).exec();
    }
  }
