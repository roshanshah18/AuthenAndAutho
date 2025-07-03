# Prisma ORM Setup Guide (Node.js + TypeScript)

This guide walks you through setting up **Prisma ORM** with a **Node.js + TypeScript** project from scratch.

---

## 1. Install Dependencies

# You can user any other package managers(Yarn, npm, pnpm).

```bash
yarn add @prisma/client
yarn add -D prisma
```

## 2. Initialize Prisma

# This Creates schema.prisma file where ever you initilize it.

```bash
npx prisma init
```

## 3. Configure .env

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

## 4. Define Schema

```bash
generator client
 {
  provider = "prisma-client-js"
}

datasource db
{
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User
 {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
}
```

## 5. Generate Prisma Client && Push Schema

# generate: creates the Prisma Client based on your schema

# db push: pushes the schema to your actual database (without migrations)

```bash
npx prisma generate

npx prisma db push

```
