import { Module } from '@nestjs/common';
import { YoutubeModule } from '../youtube/youtube.module';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';

@Module({
  imports:[YoutubeModule],
  controllers:[CronController],
  providers:[CronService]
})

export class CronModule{}