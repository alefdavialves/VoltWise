import { prisma } from '../config/database';

export function prismaMiddleware(req, res, next) {
  req.prisma = prisma;
  next();
}