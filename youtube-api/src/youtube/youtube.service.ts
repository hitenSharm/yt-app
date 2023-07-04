import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { formatRFC3339 } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Video, VideoDocument } from './Schema/video.schema';
import { Model } from 'mongoose';

@Injectable()
export class YoutubeService {
  private youtubeApis: any[];
  private currentApiIndex: number;

  constructor(private readonly configService:ConfigService, @InjectModel('Video') private videoModel:Model<VideoDocument>) {
    this.youtubeApis = [
      google.youtube({
        version: 'v3',
        auth: configService.get('API_KEY_PRIMARY'),
      }),
      google.youtube({
        version: 'v3',
        auth: configService.get('API_KEY_SECONDARY'),
      })
    ];
    this.currentApiIndex = 0;
    //array of possible apis for sending request, if expired move to next in a circular manner!
  }

  async fetchAndStoreVideos(): Promise<string> {
    const tag=this.configService.get('TAG');
    const maxResults=10;
    try {
      const formattedDateTime=formatRFC3339(new Date()); //youtube requirement
      const response=await this.youtubeApis[this.currentApiIndex].search.list({
        part:'snippet',
        q:tag,
        maxResults,
        order:'date',
        type:'video',
        publishedAfter:formattedDateTime
      });
      const videoItems=response.data.items;
      const allVideos=videoItems.map((item) => ({
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        channelId:item.snippet.channelId
        //channel id + publishedAt can help me create unique id for a vid as a channel can not really upload too many videos at exactly same timestamp precisely speaking, so it can help for
        //uniqueness of a video to check if i already have that vid in the database!(what if same video is sent by youtube again case)
      }));

      const bulkOperation=allVideos.map((video)=>({
        updateOne:{
          filter:{ publishedAt: video.publishedAt, channelId: video.channelId }, //if that combination doesent exist i insert as upsert=true;
          update:{$set:video},
          upsert:true,
        },
      }));
      //i have a bulk write operation to save those new videos
      const result=await this.videoModel.bulkWrite(bulkOperation);
      return result.upsertedCount.toString();

    } catch (error) {
      console.error(error);
      this.currentApiIndex=(this.currentApiIndex+1)%this.youtubeApis.length;
      return "moving api key";
      //assuming all errors are related to quota limit
    }
  }

  async getStoredVideosPaginated(page:number,sortBy:string):Promise<Video[]>{
    const skip=(page-1)*10;
    //10 is the limit per page
    //skip helps me skip first 10 or first 20 based on page from frontend
    const sortOrder=(sortBy === "asc" ? 1 : -1);
    return this.videoModel.find().sort({publishedAt:sortOrder}).skip(skip).limit(10).exec();
  }

  async searchVideos(page:number,query:string,sortBy:string):Promise<Video[]>{
    const skip=(page-1)*10; //10 is limit per page
    const searchRegex = new RegExp(query, 'i'); //case insensitive
    const sortOrder=(sortBy === "asc" ? 1 : -1);
    const queryOptions = {
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },//partial search
      ],
    };
    const queryResult=await this.videoModel.find(queryOptions).sort({publishedAt:sortOrder}).skip(skip).limit(10).exec();
    return queryResult;
  }

}
