import { Controller, Get, Query } from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController{

  constructor(private cronService:CronService) {
  }

  @Get('/method')
  changeCronService(@Query('search')cronMethod:string){
    //simple cronjob pause or resume functionality
    if(cronMethod==="stop"){this.cronService.changeCronStatus(false)}
    else{this.cronService.changeCronStatus(true)}
  }
}