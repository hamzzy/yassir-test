import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AirQualityQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  latitude = '';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  longitude = '';
}