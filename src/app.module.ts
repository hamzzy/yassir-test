import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirqualityModule } from './airquality/airquality.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

@Module({
  imports: [
  
  ConfigModule.forRoot({
    isGlobal: true,
  //   validationSchema: Joi.object({
  //     MONGO_DB: Joi.string(),
  //     MONGO_USER: Joi.string(),
  //     MONGO_PASSWORD: Joi.string(),
  // })
}),
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