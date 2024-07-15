import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Record, RecordSchema } from './record.schema';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { UserItemModule } from '../useritem/useritem.module';
import { HttpModule } from '@nestjs/axios';
import { User, UserSchema } from '../user/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]), 
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), UserItemModule, HttpModule, forwardRef(() => AuthModule)],
  providers: [RecordService],
  controllers: [RecordController],
  exports: [RecordService],
})
export class RecordModule {}
