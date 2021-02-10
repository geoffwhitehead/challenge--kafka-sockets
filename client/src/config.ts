type AppConfig = {
  host: string;
  port: number;
  baseUrl: string;
  socketUrl: string;
};

export const appConfig: AppConfig = {
  host: process.env.HOST || "localhost",
  port: parseInt(process.env.PORT || "3000"),
  baseUrl: process.env.BASE_URL || "http://localhost:3001/",
  socketUrl: process.env.SOCKET_URL || "http://localhost:4001/",
};
