import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  let dbPath = process.env.DATABASE_URL || './dev.db';
  
  // Удаляем префикс "file:" если есть
  if (dbPath && typeof dbPath === 'string' && dbPath.startsWith('file:')) {
    dbPath = dbPath.substring(5);
  }
  
  const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);
  
  const adapter = new PrismaBetterSqlite3({ url: `file:${resolvedPath}` });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

