import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Airquality } from '../src/airquality/schemas/airquality.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('AirQualityController (e2e)', () => {
  let app: INestApplication;
  let airqualityModel: Model<Airquality>;

  const mockAirqualityData = {
    ts: new Date(),
    aqius: 45,
    mainus: 'p2',
    aqicn: 46,
    maincn: 'p2',
    location: 'Paris',
    timestamp: new Date(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    airqualityModel = moduleFixture.get<Model<Airquality>>(
      getModelToken(Airquality.name),
    );

    await app.init();
  });

  beforeEach(async () => {
    await airqualityModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/airquality/nearest-city (GET)', () => {
    it('should return air quality data for valid coordinates', () => {
      return request(app.getHttpServer())
        .get('/airquality/nearest-city')
        .query({
          latitude: 48.856613,
          longitude: 2.352222,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('Results.pollution');
          expect(res.body.Results.pollution).toHaveProperty('aqius');
          expect(res.body.Results.pollution).toHaveProperty('mainus');
        });
    });

    it('should return 400 for invalid coordinates', () => {
      return request(app.getHttpServer())
        .get('/airquality/nearest-city')
        .query({
          latitude: 'invalid',
          longitude: 'invalid',
        })
        .expect(400);
    });
  });

  describe('/airquality/paris/history (GET)', () => {
    beforeEach(async () => {
      await airqualityModel.create(mockAirqualityData);
    });

    it('should return historical air quality data for Paris', () => {
      return request(app.getHttpServer())
        .get('/airquality/paris/history')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0]).toHaveProperty('location', 'Paris');
          expect(res.body[0]).toHaveProperty('aqius');
        });
    });
  });

  describe('/airquality/paris/most-polluted (GET)', () => {
    beforeEach(async () => {
      await airqualityModel.create({
        ...mockAirqualityData,
        aqius: 100,
        timestamp: new Date('2024-01-20T14:30:00'),
      });
    });

    it('should return the most polluted datetime for Paris', () => {
      return request(app.getHttpServer())
        .get('/airquality/paris/most-polluted')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('date');
          expect(res.body).toHaveProperty('time');
          expect(res.body).toHaveProperty('aqius', 100);
        });
    });
  });
});
