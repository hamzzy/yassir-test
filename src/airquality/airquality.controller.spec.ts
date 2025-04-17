import { Test, TestingModule } from '@nestjs/testing';
import { AirqualityController } from './airquality.controller';
import { AirqualityService } from './airquality.service';
import { AirQualityQueryDto } from './dto/query-airquality.dto';

describe('AirqualityController', () => {
  let controller: AirqualityController;
  let service: AirqualityService;

  const mockAirqualityService = {
    getAirQuality: jest.fn(),
    getParisHistory: jest.fn(),
    getMostPollutedDatetime: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirqualityController],
      providers: [
        {
          provide: AirqualityService,
          useValue: mockAirqualityService,
        },
      ],
    }).compile();

    controller = module.get<AirqualityController>(AirqualityController);
    service = module.get<AirqualityService>(AirqualityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAirQualityIndex', () => {
    const mockQuery: AirQualityQueryDto = {
      latitude: 48.856613,
      longitude: 2.352222,
    };

    const mockResponse = {
      Results: {
        pollution: {
          ts: new Date(),
          aqius: 50,
          mainus: 'p2',
          aqicn: 51,
          maincn: 'p2',
        },
      },
    };

    // it('should return air quality data for given coordinates', async () => {
    //   mockAirqualityService.getAirQuality.mockResolvedValue(mockResponse);

    //   const result = await controller.getAirQualityIndex(mockQuery);

    //   expect(result).toEqual(mockResponse);
    //   expect(service.getAirQuality).toHaveBeenCalledWith(mockQuery);
    // });

    // it('should throw an error when service fails', async () => {
    //   const error = new Error('Service error');
    //   mockAirqualityService.getAirQuality.mockRejectedValue(error);

    //   await expect(controller.getAirQualityIndex(mockQuery)).rejects.toThrow();
    // });
  });

  describe('getParisHistory', () => {
    const mockHistory = [
      {
        ts: new Date(),
        aqius: 45,
        mainus: 'p2',
        aqicn: 46,
        maincn: 'p2',
        location: 'Paris',
        timestamp: new Date(),
      },
    ];

    it('should return historical air quality data for Paris', async () => {
      mockAirqualityService.getParisHistory.mockResolvedValue(mockHistory);

      const result = await controller.getParisHistory();

      expect(result).toEqual(mockHistory);
      expect(service.getParisHistory).toHaveBeenCalled();
    });
  });

  describe('getMostPollutedDatetime', () => {
    const mockPollutedData = {
      date: '2024-01-20',
      time: '14:30:00',
      aqius: 75,
      mainus: 'p2',
    };

    it('should return the most polluted datetime for Paris', async () => {
      mockAirqualityService.getMostPollutedDatetime.mockResolvedValue(mockPollutedData);

      const result = await controller.getMostPollutedDatetime();

      expect(result).toEqual(mockPollutedData);
      expect(service.getMostPollutedDatetime).toHaveBeenCalled();
    });
  });
});
