import * as dotenv from 'dotenv';

dotenv.config();

export const enviroment = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT),
  HOST: process.env.HOST,
  OTP_SECRET_KEY: process.env.OTP_SECRET_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  WHITELISTED_ORIGINS: process.env.WHITELISTED_ORIGINS.split(','),
  PINO_LOG_LEVEL: process.env.PINO_LOG_LEVEL,
  JWT_SECRET: process.env.JWT_SECRET,
  ENVIROMENT: process.env.ENVIROMENT,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
};
