import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Item, ItemSchema } from './item.schema';

@Schema()
export class UserItem extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ type: [ItemSchema], default: [] })
  items: Item[];
}

export const UserItemSchema = SchemaFactory.createForClass(UserItem);
