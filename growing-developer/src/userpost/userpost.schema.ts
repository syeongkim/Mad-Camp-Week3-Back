import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post, PostSchema } from './post.schema';

@Schema()
export class UserPost extends Document {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
  posts: Post[];
}

export const UserPostSchema = SchemaFactory.createForClass(UserPost);
