import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RecordService } from './record.service';
import { Record } from './record.schema';

@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  async createRecord(@Body() record: Record): Promise<Record> {
    return this.recordService.createRecord(record);
  }

  @Get()
  async getRecords(): Promise<Record[]> {
    return this.recordService.getRecords();
  }

  @Get(':username')
  async getRecordByUsername(@Param('username') username: string): Promise<Record> {
    return this.recordService.getRecordByUsername(username);
  }

  @Put(':username')
  async updateRecord(@Param('username') username: string, @Body() updateData: Partial<Record>): Promise<Record> {
    return this.recordService.updateRecord(username, updateData);
  }

  @Delete(':username')
  async deleteRecord(@Param('username') username: string): Promise<Record> {
    return this.recordService.deleteRecord(username);
  }
}
