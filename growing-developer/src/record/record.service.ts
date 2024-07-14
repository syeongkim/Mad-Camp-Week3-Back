import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from './record.schema';

@Injectable()
export class RecordService {
  constructor(@InjectModel(Record.name) private recordModel: Model<Record>) {}

  async createRecord(recordData: Partial<Record>): Promise<Record> {
    const newRecord = new this.recordModel(recordData);
    return newRecord.save();
  }

  async getRecords(): Promise<Record[]> {
    return this.recordModel.find().exec();
  }

  async getRecordByUsername(username: string): Promise<Record> {
    return this.recordModel.findOne({ username }).exec();
  }

  async updateRecord(username: string, updateData: Partial<Record>): Promise<Record> {
    return this.recordModel.findOneAndUpdate({ username }, updateData, { new: true }).exec();
  }

  async deleteRecord(username: string): Promise<Record> {
    return this.recordModel.findOneAndDelete({ username }).exec();
  }
}
