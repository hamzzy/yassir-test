import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirqualityModule } from './airquality/airquality.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi'
@Module({
  imports: [
  
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_USERNAME: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('MONGO_USERNAME');
        const password = configService.get('MONGO_PASSWORD');
        const database = configService.get('MONGO_DATABASE');
        const host = configService.get('MONGO_HOST');
 
        return {
          uri: `mongodb://${username}:${password}@${host}`,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
   AirqualityModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  },],
})
export class AppModule {}

//ConfigModule.forRoot({
  //   load: [configuration],
  //   validationSchema: Joi.object({
  //     DB_NAME: Joi.string(),
  //     DB_HOST: Joi.string(),
  //     DB_PORT: Joi.number().default(1433),
  //     DB_USER: Joi.string(),
  //     DB_PASSWORD: Joi.string(),
  //   }),
  // }),