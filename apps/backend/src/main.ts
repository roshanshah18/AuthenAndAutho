import express, { Request, Response, NextFunction } from 'express';
import { enviroment } from './config/enviroment';
import { APIError } from './utils/error';
import { generateEndPoints } from './router/merge';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './utils/swagger';
import { errorHandler, notFoundHandler } from './utils/errorhandler';
import { logger, loggerMiddleware } from './utils/logger';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
console.log(
  'API Docs:',
  `http://${enviroment.HOST}:${enviroment.PORT}/api-docs`
);
app.use(
  cors({
    origin: function (origin, callback) {
      logger.debug(`Origin: ${origin}`);
      if (!origin || enviroment.WHITELISTED_ORIGINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

generateEndPoints(app);
app.use(loggerMiddleware);

app.use(notFoundHandler);
app.use(errorHandler);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof APIError) {
    res.status(error.status).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
    return;
  }

  res.status(500).json({
    message: 'Something went wrong on the server',
    data: null,
    isSuccess: false,
  });
});

app.listen(enviroment.PORT, enviroment.HOST, () => {
  console.log(`[ ready ] http://${enviroment.HOST}:${enviroment.PORT}`);
});
