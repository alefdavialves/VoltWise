// backend/src/routes/index.js
import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { VehicleController } from '../controllers/VehicleController.js';
import { prismaMiddleware } from '../middlewares/prismaMiddleware.js';

const routes = Router();

// Aplica o middleware para todas as rotas abaixo
routes.use(prismaMiddleware);

// Rotas de Usuários
routes.post('/users', UserController.create);

// Rotas de Veículos
routes.post('/vehicles', VehicleController.create);
routes.get('/vehicles', VehicleController.listAll);

export default routes;