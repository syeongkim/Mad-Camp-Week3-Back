import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Item extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  stocks: number;

  @Prop({ required: true, default: false })
  current: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
