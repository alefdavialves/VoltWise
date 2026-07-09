import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const routes = Router();

// Rota que vai receber o cadastro de usuários
routes.post('/users', UserController.create);

export default routes;