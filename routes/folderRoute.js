import { Router } from 'express';

import {
  getFoldersController,
  createFolderController,
  getFolderController,
  getEditFolderController,
  putRenameFolderController,
  deleteFolderController,
} from '../controllers/folderController.js';
import isAuth from '../middleware/auth.js';

export const folderRoutes = Router();

folderRoutes.route('/').get(isAuth, getFoldersController).post(isAuth, createFolderController);
folderRoutes.get('/:folderId/edit', isAuth, getEditFolderController);
folderRoutes
  .route('/:folderId')
  .get(isAuth, getFolderController)
  .put(isAuth, putRenameFolderController)
  .delete(isAuth, deleteFolderController);
