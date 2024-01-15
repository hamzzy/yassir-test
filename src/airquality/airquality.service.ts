import { Injectable, Logger } from '@nestjs/common';
import { AirQualityQueryDto } from './dto/query-airquality.dto';
import { IQRIClient } from 'src/utils/BaseClient';
import { AirQualityResult } from './interfaces/airquality-result.interface';
import { PARIS_LAT, PARIS_LONG } from 'src/common/constant/constant';
import { Cron } from '@nestjs/schedule';
import { Airquality, AirqualityDocument } from './schemas/airquality.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class AirqualityService {

  private readonly logger = new Logger(AirqualityService.name);
  constructor(@InjectModel(Airquality.name) private airqualityModel: Model<AirqualityDocument>) {}

  async getAirQuality (airQualityQuery: AirQualityQueryDto): Promise<AirQualityResult | null> {
    try {
      const data = await IQRIClient<any>('GET', 'nearest_city', { lat: airQualityQuery.latitude, lon: airQualityQuery.longitude });
  
      // Assuming 'data.current.pollution' exists, otherwise handle accordingly
      const pollutionData = data?.data?.current?.pollution;
  
      if (pollutionData) {
        // Map the relevant properties to the desired structure
        const result: AirQualityResult = {
          Results:{
          pollution: {
            ts: pollutionData.ts,
            aqius: pollutionData.aqius,
            mainus: pollutionData.mainus,
            aqicn: pollutionData.aqicn,
            maincn: pollutionData.maincn,
          },
        }
        
        };
        
  
        return result
      }
  
      return null; // or handle the case where 'pollution' data is not present
    } catch (error) {
      throw new Error('Failed to fetch air quality data.');
    }
  }

 @Cron( '*/1 * * * *' )
 async ParisAirqualityData() {
  // Cron job to save Paris data    
   try{      
    const data = await IQRIClient<any>('GET', 'nearest_city', { lat:PARIS_LAT , lon: PARIS_LONG  });
    const pollutionData = data?.data?.current.pollution;
    if( pollutionData){
      const create=new this.airqualityModel(pollutionData)
      create.save();
      this.logger.log(`Paris air Quality Data saved`);
    }
    this.logger.log('Paris data saved',pollutionData);
   }catch (error) {
    this.logger.error(`Error ${error.message}`);
    throw new Error('couldnt save data');

   }

    }


    async getMostPollutedDatetime(): Promise<Date | any> {
      const mostPollutedRecord = await this.airqualityModel
      .findOne()
      .sort({ aqius: -1, aqicn: -1 })
      .limit(1);
      if ( mostPollutedRecord){
      const [date, time] = mostPollutedRecord['created'].toLocaleString().split(' '); 
      return {"date": date,"time": time}
      }
      return {}
    }

}
