import { Module } from '@nestjs/common';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './Schema/video.schema';


@Module({
  imports:[ConfigModule.forRoot({}),MongooseModule.forFeature([{name:'Video',schema:VideoSchema}])],
  controllers:[YoutubeController],
  providers:[YoutubeService],
  exports:[YoutubeService]
})
export class YoutubeModule{}