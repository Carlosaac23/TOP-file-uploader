import { Router } from 'express';

import {
  getRegister,
  postRegister,
  getLoginController,
  postLoginController,
  logoutController,
  successController,
} from '../controllers/authController.js';
import isAuth from '../middleware/auth.js';

export const authRoutes = Router();

authRoutes.route('/').get(getLoginController).post(postLoginController);
authRoutes.route('/register').get(getRegister).post(postRegister);
authRoutes.get('/logout', logoutController);
authRoutes.get('/success', isAuth, successController);
