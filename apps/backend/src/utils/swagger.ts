import { generateOpenApi } from '@ts-rest/open-api';
import { contract } from '@expense-tracker/contract/routers/index';

export const openApiDocument = generateOpenApi(contract, {
  info: {
    title: 'Expense-Tracker-API',
    version: '1.0.0',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
});
