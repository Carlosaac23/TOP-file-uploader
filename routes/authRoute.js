import { Router } from 'express';

import { getUserHomeController } from '../controllers/authController.js';

export const authRoutes = Router();

authRoutes.get('/home', getUserHomeController);
