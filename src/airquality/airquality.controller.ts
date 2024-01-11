import { Controller, Get, Query } from '@nestjs/common';
import { AirqualityService } from './airquality.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AirQualityQueryDto } from './dto/query-airquality.dto';
import { AirQualityResult } from './interfaces/airquality-result.interface';

@Controller('airquality')
export class AirqualityController {
  constructor(private readonly airqualityService: AirqualityService) {}

  
  @ApiOperation({ summary: 'Get air quality' })
  @ApiResponse({
    description:
      'To get current Air Quality details for a particular location using latitude and longitude',
  })
  @Get()
  @ApiBody({ type:  AirQualityQueryDto })
  async getAirQualityIndex(@Query() airQualityQuery: AirQualityQueryDto): Promise<AirQualityResult> {
    return await this.airqualityService.getAirQuality(airQualityQuery);
  }
}
