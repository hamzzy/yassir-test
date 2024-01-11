import { Test, TestingModule } from '@nestjs/testing';
import { AirqualityController } from './airquality.controller';
import { AirqualityService } from './airquality.service';

describe('AirqualityController', () => {
  let controller: AirqualityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirqualityController],
      providers: [AirqualityService],
    }).compile();

    controller = module.get<AirqualityController>(AirqualityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
