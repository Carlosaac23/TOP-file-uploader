import { Router } from 'express';

import { getUserHomeController } from '../controllers/authController.js';
import { createFolderController } from '../controllers/folderController.js';
import isAuth from '../middleware/auth.js';

export const authRoutes = Router();

authRoutes.route('/home').get(isAuth, getUserHomeController).post(isAuth, createFolderController);
