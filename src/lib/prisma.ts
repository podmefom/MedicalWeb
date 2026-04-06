import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

const prismaClientSingleton = () => {
  const sqlite = new Database('./dev.db');
  const adapter = new PrismaBetterSqlite(sqlite);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

