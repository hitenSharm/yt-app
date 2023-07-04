import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Video{
  @Prop({ required: true, index: true }) //indexed for faster response in searching
  title: string;

  @Prop()
  description: string; //some vids dont have a description

  @Prop({ required: true })
  publishedAt: Date;

  @Prop({required: true})
  channelId:string;
}

export type VideoDocument=Video & Document;
export const VideoSchema = SchemaFactory.createForClass(Video);
