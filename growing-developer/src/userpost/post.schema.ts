import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  contents: string;

  @Prop({ required: true, default: false })
  read: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.set('timestamps', { createdAt: true, updatedAt: true });