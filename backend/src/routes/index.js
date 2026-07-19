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

// Rota 1: Listar apenas os veículos de um usuário específico
routes.get("/users/:userId/vehicles", UserController.userVehicles)

// Rota 2: Listar o perfil completo do usuário trazendo os seus veículos inclusos
routes.get("/users/:userId/profile", UserController.userWithCars);

//Rota 3: Login de usuário
routes.post("/login", UserController.login);


// Rotas de Veículos
routes.post('/vehicles', VehicleController.create);
routes.get('/vehicles', VehicleController.listAll);7
routes.delete("/vehicles/:vehicleId", VehicleController.delete);

export default routes;