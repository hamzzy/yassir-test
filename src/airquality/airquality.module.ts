import { Module } from '@nestjs/common';
import { AirqualityService } from './airquality.service';
import { AirqualityController } from './airquality.controller';

@Module({
  controllers: [AirqualityController],
  providers: [AirqualityService]
})
export class AirqualityModule {}
