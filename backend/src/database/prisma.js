import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'], // Mostra os SQLs rodando no terminal para facilitar o debug
});