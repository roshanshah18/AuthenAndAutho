# Swagger (OpenAPI) Setup Guide – Node.js + TypeScript + Express

This guide shows how to integrate **Swagger UI** to document your Express REST API built with TypeScript.

---

## 1. Install Dependencies

# You can user any other package managers(Yarn, npm, pnpm).

```bash
yarn add swagger-ui-express swagger-jsdoc @ts-rest/open-api
```

## 2. Create OpenApiPoint

## All the contracts that created should be imported here as a single contract.

## create swagger.ts file and put this their.

```bash
export const openApiDocument = generateOpenApi(contract,
{
  info:
  {
    title: 'Title For Your API',
    version: '1.0.0',
  },
});

```

## 3. Import Created OpenApiEndPoints in main.ts file.

```bash
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
console.log(
  'API Docs:',
  `http://${enviroment.HOST}:${enviroment.PORT}/api-docs`
);
```
