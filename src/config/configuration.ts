
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    },
    iqair_api_key : process.env.IQAIR_API_KEY,
    redis : process.env.REDIS
  });
  