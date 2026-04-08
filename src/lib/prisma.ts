import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  console.log('[PRISMA] Инициализация PrismaClient');
  console.log('[PRISMA] DATABASE_URL:', process.env.DATABASE_URL);
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'info'] : ['error'],
  });
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

