import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Video } from './Schema/video.schema';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService:YoutubeService) {
  }

  @Get('/store')
  async storeLatestVideos(){
    //fetches new vids and stores in db
    return await this.youtubeService.fetchAndStoreVideos();
  }

  @Get('/videos')
  async getStoredVideos(@Query('page' ,new DefaultValuePipe(1),ParseIntPipe) page:number,@Query('sorted')sortBy:string):Promise<Video[]>{
    //default value of page is 1
    return this.youtubeService.getStoredVideosPaginated(page,sortBy);
  }

  @Get('/search')
  async startSearching(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,@Query('sorted')sortBy:string,@Query('q') query?: string):Promise<Video[]>{
    return this.youtubeService.searchVideos(page,query,sortBy);
  }

  @Get('/refresh')
  async refreshResults(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,@Query('sorted')sortBy:string,@Query('q') query?: string):Promise<Video[]>{
    await this.youtubeService.fetchAndStoreVideos();
    console.log("refreshed");
    if(query){
      //fetch and return based on search
      return this.youtubeService.searchVideos(page,query,sortBy);
    }else{
      //simple fetch and return
      return this.youtubeService.getStoredVideosPaginated(page,sortBy);
    }
  }

}
