import { PartialType } from '@nestjs/swagger';
import { CreateAirqualityDto } from './create-airquality.dto';

export class UpdateAirqualityDto extends PartialType(CreateAirqualityDto) {}
