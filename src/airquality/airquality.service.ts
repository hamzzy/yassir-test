import { Injectable } from '@nestjs/common';
import { AirQualityQueryDto } from './dto/query-airquality.dto';
import { IQRIClient } from 'src/utils/BaseClient';
import { AirQualityResult } from './interfaces/airquality-result.interface';




@Injectable()
export class AirqualityService {

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



}
