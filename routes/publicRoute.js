import { Router } from 'express';

import {
  getIndexController,
  getRegisterFormController,
  postRegisterController,
  getLoginFormController,
  postLoginController,
  getLogoutController,
} from '../controllers/publicController.js';

export const publicRoutes = Router();

publicRoutes.get('/', getIndexController);
publicRoutes.route('/register').get(getRegisterFormController).post(postRegisterController);
publicRoutes.route('/login').get(getLoginFormController).post(postLoginController);
publicRoutes.get('/logout', getLogoutController);
