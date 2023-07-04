import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubeModule } from './youtube/youtube.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [YoutubeModule,ScheduleModule.forRoot(),CronModule,ConfigModule.forRoot({isGlobal:true}),MongooseModule.forRootAsync({
    imports:[ConfigModule],
    useFactory:(configService:ConfigService)=>({
      uri:configService.get('MONGO_URI'), //this is just config for mongo
    }),
    inject:[ConfigService],
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
