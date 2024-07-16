import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Record extends Document {
  @ApiProperty({ description: '사용자의 github ID', example: 'syeongkim' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: '코인 개수', example: 0 })
  @Prop({ required: true, default: 0 })
  coin: number;

  @ApiProperty({ description: '오늘 커밋 여부', example: false })
  @Prop({ default: false })
  hasCommit: boolean;

  @ApiProperty({ description: '이번 달 커밋 횟수', example: 24 })
  @Prop({ default: 0 })
  commitCount: number;

  @ApiProperty({ description: '현재 착용하고 있는 아이템들', example: ["coffee", "hoodie"] })
  @Prop({ type: [String], default: [] })
  wearing_items: string[];

  @ApiProperty({ description: '한마디', example: 'no message' })
  @Prop({ default: "no message" })
  message: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
