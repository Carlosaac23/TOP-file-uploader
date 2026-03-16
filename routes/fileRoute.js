import { Router } from 'express';

import {
  getFileController,
  putEditFileController,
  deleteFileController,
} from '../controllers/fileController.js';
import isAuth from '../middleware/auth.js';

export const fileRoutes = Router();

fileRoutes
  .route('/:fileId')
  .get(isAuth, getFileController)
  .put(isAuth, putEditFileController)
  .delete(isAuth, deleteFileController);
