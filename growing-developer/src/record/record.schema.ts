import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Record extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  coin: number;

  @Prop({ type: [String], default: [] })
  commits: string[];

  @Prop()
  message: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
