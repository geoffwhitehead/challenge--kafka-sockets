type AppConfig = {
  host: string;
  port: number;
  socketPort: number;
  serverPort: number;
  serverHost: string;
};

export const appConfig: AppConfig = {
  host: process.env.HOST || "localhost",
  port: parseInt(process.env.PORT || "3000"),
  socketPort: parseInt(process.env.SOCKET_PORT || "4001"),
  serverPort: parseInt(process.env.SERVER_PORT || "3001"),
  serverHost: process.env.SERVER_HOST || "localhost",
};
