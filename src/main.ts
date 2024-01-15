import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
async function bootstrap(): Promise<void>  {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })

  const options = new DocumentBuilder()
   .setTitle('Air Quality API')
  .setDescription('API for retrieving air quality information')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true,}));
  app.enableCors();
  app.useLogger(app.get(Logger));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  await app.listen(3000);
}
bootstrap();
