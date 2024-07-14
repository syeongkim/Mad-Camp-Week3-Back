import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Item, ItemSchema } from './item.schema';

@Schema()
export class UserItem extends Document {
  @ApiProperty({ description: '사용자의 github ID', example: 'syeongkim' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: '사용자가 소유하고 있는 item들의 이름, 재고, 현재 착용 여부', example: '[{"name": "coffee","stocks": 1,"current": true},{"name": "hoodie","stocks": 1,"current": true},{"name": "shirt","stocks": 2,"current": false}]' })
  @Prop({ type: [ItemSchema], default: [] })
  items: Item[];
}

export const UserItemSchema = SchemaFactory.createForClass(UserItem);
