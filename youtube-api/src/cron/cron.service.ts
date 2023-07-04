import { Inject, Injectable } from '@nestjs/common';
import { YoutubeService } from '../youtube/youtube.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService{
  @Inject(YoutubeService)
  private readonly youtubeService:YoutubeService;

  private shouldCronRun:Boolean=true;

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updatingInfo(){
    console.log('going in')
    if(!this.shouldCronRun){
      console.log("paused")
      return ;
    }
    //pause based on bool
    const result=await this.youtubeService.fetchAndStoreVideos();
    console.log(result);
  }

  changeCronStatus(shouldCronRun:Boolean){
    this.shouldCronRun=shouldCronRun;
  }
}