import { Module } from '@nestjs/common';
import { AirqualityService } from './airquality.service';
import { AirqualityController } from './airquality.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AirQualitySchema, Airquality } from './schemas/airquality.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Airquality.name, schema: AirQualitySchema  }]),
  ],
  controllers: [AirqualityController],
  providers: [AirqualityService]
})
export class AirqualityModule {}
