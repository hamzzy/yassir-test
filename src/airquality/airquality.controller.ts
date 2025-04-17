import { Controller, Get, Query } from '@nestjs/common';
import { AirqualityService } from './airquality.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AirQualityQueryDto } from './dto/query-airquality.dto';
import { AirQualityResult } from './interfaces/airquality-result.interface';

@ApiTags('airquality')
@Controller('airquality')
export class AirqualityController {
  constructor(private readonly airqualityService: AirqualityService) {}

  @ApiOperation({ summary: 'Get air quality for nearest city' })
  @ApiResponse({
    status: 200,
    description: 'Returns air quality data for the nearest city to the given coordinates',
  })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @Get('nearest-city')
  async getAirQualityIndex(@Query() airQualityQuery: AirQualityQueryDto): Promise<AirQualityResult> {
    return await this.airqualityService.getAirQuality(airQualityQuery);
  }

  @ApiOperation({ summary: 'Get historical air quality data for Paris' })
  @ApiResponse({
    status: 200,
    description: 'Returns historical air quality data for Paris',
  })
  @Get('paris/history')
  async getParisHistory() {
    return await this.airqualityService.getParisHistory();
  }

  @ApiOperation({ summary: 'Get most polluted datetime in Paris' })
  @ApiResponse({
    status: 200,
    description: 'Returns the date and time when Paris had the most polluted air',
  })
  @Get('paris/most-polluted')
  async getMostPollutedDatetime() {
    return await this.airqualityService.getMostPollutedDatetime();
  }
}
