import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RecordService } from './record.service';
import { Record } from './record.schema';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('records')
@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  async createRecord(@Body() recordData: Partial<Record>): Promise<Record> {
    return this.recordService.createRecord(recordData);
  }

  // @Get()
  // async getRecords(): Promise<Record[]> {
  //   return this.recordService.getRecords();
  // }

  @Get(':username')
  async getRecordByUsername(@Param('username') username: string): Promise<Record> {
    // await this.recordService.updateHasCommit(username);
    await this.recordService.updateWearingItems(username);
    return this.recordService.getRecordByUsername(username);
  }

  @Put(':username')
  @ApiBody({ type: Record })
  async updateRecord(@Param('username') username: string, @Body() updateData: Partial<Record>): Promise<Record> {
    return this.recordService.updateRecord(username, updateData);
  }

  @Delete(':username')
  async deleteRecord(@Param('username') username: string): Promise<Record> {
    return this.recordService.deleteRecord(username);
  }
}
