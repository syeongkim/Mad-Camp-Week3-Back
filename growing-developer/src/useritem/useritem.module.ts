import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserItemService } from './useritem.service';
import { UserItemController } from './useritem.controller';
import { UserItem, UserItemSchema } from './useritem.schema';
import { PostModule } from '../post/post.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserItem.name, schema: UserItemSchema }]), PostModule],
  providers: [UserItemService],
  controllers: [UserItemController],
  exports: [UserItemService],
})
export class UserItemModule {}
