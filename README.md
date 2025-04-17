# Air Quality API

A NestJS REST API that provides air quality information for the nearest city to given GPS coordinates using the IQAir API. The service includes a CRON job that periodically checks and stores air quality data for Paris.

## Features

- Get air quality data for any location using latitude and longitude
- CRON job that checks Paris air quality every minute
- MongoDB integration for data storage
- Swagger API documentation
- Comprehensive error handling
- Logging with Pino
- Docker support for easy deployment

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js and Yarn (for local development)
- IQAir API key (register at https://www.iqair.com/dashboard/api)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGO_USERNAME=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password
MONGO_DATABASE=your_database_name
MONGO_HOST=mongo

# IQAir API Configuration
IQAIR_API_KEY=your_iqair_api_key

```

## API Endpoints

- `GET /airquality/nearest-city`: Get air quality data for the nearest city
  - Query Parameters:
    - `latitude`: Latitude coordinate
    - `longitude`: Longitude coordinate
- `GET /airquality/paris/history`: Get historical air quality data for Paris
- `GET /airquality/paris/most-polluted`: Get the datetime when Paris was most polluted

## Running with Docker

1. Build and start the containers:
```bash
docker-compose up --build
```

2. To run in detached mode:
```bash
docker-compose up -d
```

3. To stop the containers:
```bash
docker-compose down
```

## Services

- **Air Quality App**: Runs on port 3000
- **MongoDB**: Runs on port 27017

## Development

The application uses volume mounting, so any changes you make to the source code will be reflected in the container immediately.

### Running Tests

```bash
# Unit tests
npm test

# e2e tests
npm test:e2e

# Test coverage
npm test:cov
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Health Checks

The MongoDB container includes health checks to ensure the database is ready before starting the application.

## Troubleshooting

If you encounter any issues:

1. Check if all containers are running:
```bash
docker-compose ps
```

2. View logs:
```bash
docker-compose logs
```

3. Rebuild containers if needed:
```bash
docker-compose down
docker-compose up --build
```