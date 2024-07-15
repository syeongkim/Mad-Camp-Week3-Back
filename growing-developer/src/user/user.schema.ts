import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User extends Document {
  @ApiProperty({ description: '사용자의 github ID', example: 'syeongkim' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: '사용자의 github 프로필 사진', example: 'https://avatars.githubusercontent.com/u/107764281?v=4' })
  @Prop()
  profile: string;

  @ApiProperty({ description: '사용자의 github access_token', example: 'abcd' })
  @Prop()
  access_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);