import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AirQualityQueryDto } from './dto/query-airquality.dto';
import { IQRIClient } from '../utils/BaseClient';
import { AirQualityResult } from './interfaces/airquality-result.interface';
import { PARIS_LAT, PARIS_LONG } from '../common/constant/constant';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Airquality, AirqualityDocument } from './schemas/airquality.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AirqualityService {

  private readonly logger = new Logger(AirqualityService.name);

  constructor(@InjectModel(Airquality.name) private readonly airqualityModel: Model<AirqualityDocument>) {}

  async getAirQuality(airQualityQuery: AirQualityQueryDto): Promise<AirQualityResult> {
    try {
      const data = await IQRIClient<any>('GET', 'nearest_city', { 
        lat: airQualityQuery.latitude, 
        lon: airQualityQuery.longitude 
      });

      const pollutionData = data?.data?.current?.pollution;

      if (!pollutionData) {
        throw new HttpException('No air quality data found for the given coordinates', HttpStatus.NOT_FOUND);
      }

      return {
        Results: {
          pollution: {
            ts: pollutionData.ts,
            aqius: pollutionData.aqius,
            mainus: pollutionData.mainus,
            aqicn: pollutionData.aqicn,
            maincn: pollutionData.maincn,
          },
        },
      };
    } catch (error) {
      this.handleError(error, 'Failed to fetch air quality data');
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async ParisAirqualityData() {
    try {
      const data = await IQRIClient<any>('GET', 'nearest_city', { 
        lat: PARIS_LAT, 
        lon: PARIS_LONG 
      });      
      const pollutionData = data?.data?.current?.pollution;

      if (!pollutionData) {
        this.logger.warn('No air quality data found for Paris');
        return;
      }

      const newAirQuality = await this.airqualityModel.create({
        ...pollutionData,
        location: 'Paris',
        timestamp: new Date()
      });
      
      this.logger.log('Paris air quality data saved successfully');
      return newAirQuality;
    } catch (error) {
      this.handleError(error, 'Failed to save Paris air quality data');
    }
  }

  async getParisHistory() {
    try {
      const history = await this.airqualityModel
        .find({ location: 'Paris' })
        .sort({ timestamp: -1 })
        .limit(100)
        .exec();

      if (!history.length) {
        throw new HttpException('No historical data found for Paris', HttpStatus.NOT_FOUND);
      }

      return history;
    } catch (error) {
      this.handleError(error, 'Failed to get Paris air quality history');
    }
  }

  async getMostPollutedDatetime() {
    try {
      const mostPollutedRecord = await this.airqualityModel
        .findOne({ location: 'Paris' })
        .sort({ aqius: -1 })
        .exec();

      if (!mostPollutedRecord) {
        throw new HttpException('No air quality data found for Paris', HttpStatus.NOT_FOUND);
      }

      return {
        date: mostPollutedRecord.timestamp.toLocaleDateString(),
        time: mostPollutedRecord.timestamp.toLocaleTimeString(),
        aqius: mostPollutedRecord.aqius,
        mainus: mostPollutedRecord.mainus
      };
    } catch (error) {
      this.handleError(error, 'Failed to get most polluted datetime');
    }
  }

  private handleError(error: any, message: string): never {
    this.logger.error(`Error: ${error.message}`);
    
    if (error instanceof HttpException) {
      throw error;
    }
    
    throw new HttpException(
      message,
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
