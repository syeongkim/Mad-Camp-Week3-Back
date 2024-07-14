import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Record extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, default: 0 })
  coin: number;

  @Prop({ default: false })
  commits: boolean;

  @Prop({ default: "no message" })
  message: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
