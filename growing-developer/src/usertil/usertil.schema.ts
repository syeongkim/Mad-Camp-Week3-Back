import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Til, TilSchema } from './til.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class UserTil extends Document {
  @ApiProperty({ description: 'Username', example: 'syeongkim' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ type: [Til], description: 'List of TILs' })
  @Prop({ type: [TilSchema], default: [] })
  til: Til[];
}

export const UserTilSchema = SchemaFactory.createForClass(UserTil);
