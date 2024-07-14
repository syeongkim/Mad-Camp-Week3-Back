import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

@Schema()
export class Til extends Document {
  @ApiProperty({ description: 'TIL ID', example: 0 })
  @Prop({ unique: true })
  id: number;

  @ApiProperty({ description: 'Contents of TIL', example: '오늘은 react와 node 버전을 맞췄다.' })
  @Prop({ required: true })
  contents: string;

  @ApiProperty({ description: 'Images related to TIL', example: [] })
  @Prop({ type: [String], default: [] })
  images: string[];
}

export const TilSchema = SchemaFactory.createForClass(Til);

TilSchema.set('timestamps', { createdAt: true, updatedAt: true });

// TilSchema.plugin(AutoIncrement, { inc_field: 'id' });