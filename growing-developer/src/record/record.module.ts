import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Record, RecordSchema } from './record.schema';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { UserItemModule } from '../useritem/useritem.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]), UserItemModule],
  providers: [RecordService],
  controllers: [RecordController],
  exports: [RecordService],
})
export class RecordModule {}
