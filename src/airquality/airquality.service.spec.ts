import { Test, TestingModule } from '@nestjs/testing';
import { AirqualityService } from './airquality.service';
import { getModelToken } from '@nestjs/mongoose';
import { Airquality } from './schemas/airquality.schema';
import { Model } from 'mongoose';
import { HttpException } from '@nestjs/common';
import { IQRIClient } from '../utils/BaseClient';

jest.mock('../utils/BaseClient');

describe('AirqualityService', () => {
  let service: AirqualityService;
  let model: Model<Airquality>;

  const mockAirqualityModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    sort: jest.fn(),
    limit: jest.fn(),
    prototype: {
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirqualityService,
        {
          provide: getModelToken(Airquality.name),
          useValue: mockAirqualityModel,
        },
      ],
    }).compile();

    service = module.get<AirqualityService>(AirqualityService);
    model = module.get<Model<Airquality>>(getModelToken(Airquality.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAirQuality', () => {
    const mockQuery = {
      latitude: 48.856613,
      longitude: 2.352222,
    };

    const mockIQAirResponse = {
      data: {
        current: {
          pollution: {
            ts: '2024-01-20T14:00:00.000Z',
            aqius: 50,
            mainus: 'p2',
            aqicn: 51,
            maincn: 'p2',
          },
        },
      },
    };

    it('should return air quality data for given coordinates', async () => {
      (IQRIClient as jest.Mock).mockResolvedValue(mockIQAirResponse);

      const result = await service.getAirQuality(mockQuery);

      expect(result).toEqual({
        Results: {
          pollution: mockIQAirResponse.data.current.pollution,
        },
      });
      expect(IQRIClient).toHaveBeenCalledWith('GET', 'nearest_city', {
        lat: mockQuery.latitude,
        lon: mockQuery.longitude,
      });
    });

    it('should throw HttpException when no pollution data is found', async () => {
      (IQRIClient as jest.Mock).mockResolvedValue({ data: { current: {} } });

      await expect(service.getAirQuality(mockQuery)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when API call fails', async () => {
      (IQRIClient as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(service.getAirQuality(mockQuery)).rejects.toThrow(HttpException);
    });
  });

  describe('getParisHistory', () => {
    const mockHistoryData = [
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
      mockAirqualityModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockHistoryData),
          }),
        }),
      });

      const result = await service.getParisHistory();

      expect(result).toEqual(mockHistoryData);
      expect(mockAirqualityModel.find).toHaveBeenCalledWith({ location: 'Paris' });
    });

    it('should throw HttpException when no historical data is found', async () => {
      mockAirqualityModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.getParisHistory()).rejects.toThrow(HttpException);
    });
  });

  describe('getMostPollutedDatetime', () => {
    const mockPollutedData = {
      ts: new Date('2024-01-20T14:30:00'),
      aqius: 75,
      mainus: 'p2',
      location: 'Paris',
      timestamp: new Date('2024-01-20T14:30:00'),
    };

    it('should return the most polluted datetime for Paris', async () => {
      mockAirqualityModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockPollutedData),
        }),
      });

      const result = await service.getMostPollutedDatetime();

      expect(result).toEqual({
        date: mockPollutedData.timestamp.toLocaleDateString(),
        time: mockPollutedData.timestamp.toLocaleTimeString(),
        aqius: mockPollutedData.aqius,
        mainus: mockPollutedData.mainus,
      });
      expect(mockAirqualityModel.findOne).toHaveBeenCalledWith({ location: 'Paris' });
    });

    it('should throw HttpException when no data is found', async () => {
      mockAirqualityModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.getMostPollutedDatetime()).rejects.toThrow(HttpException);
    });
  });

  describe('ParisAirqualityData', () => {
    const mockIQAirResponse = {
      data: {
        current: {
          pollution: {
            ts: '2024-01-20T14:00:00.000Z',
            aqius: 50,
            mainus: 'p2',
            aqicn: 51,
            maincn: 'p2',
          },
        },
      },
    };

    it('should save Paris air quality data successfully', async () => {
      (IQRIClient as jest.Mock).mockResolvedValue(mockIQAirResponse);
      mockAirqualityModel.create.mockResolvedValue({
        ...mockIQAirResponse.data.current.pollution,
        location: 'Paris',
        timestamp: expect.any(Date)
      });

      await service.ParisAirqualityData();

      expect(IQRIClient).toHaveBeenCalledWith('GET', 'nearest_city', {
        lat: expect.any(Number),
        lon: expect.any(Number),
      });
      expect(mockAirqualityModel.create).toHaveBeenCalledWith({
        ...mockIQAirResponse.data.current.pollution,
        location: 'Paris',
        timestamp: expect.any(Date)
      });
    });

    it('should handle missing pollution data gracefully', async () => {
      (IQRIClient as jest.Mock).mockResolvedValue({ data: { current: {} } });

      await service.ParisAirqualityData();

      expect(mockAirqualityModel.create).not.toHaveBeenCalled();
    });
  });
});
