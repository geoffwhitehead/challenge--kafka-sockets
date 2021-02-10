type AppConfig = {
  KAFKA_HOST: string;
  KAFKA_PORT: number;
  PORT: number;
  WS_PORT: number;
};

export const appConfig: AppConfig = {
  KAFKA_HOST: process.env.KAFKA_HOST || 'localhost',
  KAFKA_PORT: parseInt(process.env.KAFKA_PORT) || 9094,
  PORT: parseInt(process.env.PORT) || 3001,
  WS_PORT: parseInt(process.env.PORT) || 4001,
};
