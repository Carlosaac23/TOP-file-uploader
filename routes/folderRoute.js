import { Router } from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import {
  getFoldersController,
  createFolderController,
  getFolderController,
  putRenameFolderController,
  deleteFolderController,
  postUploadToFolderController,
} from '../controllers/folderController.js';
import isAuth from '../middleware/auth.js';

export const folderRoutes = Router();

folderRoutes.route('/').get(isAuth, getFoldersController).post(isAuth, createFolderController);
folderRoutes
  .route('/:folderId')
  .get(isAuth, getFolderController)
  .put(isAuth, putRenameFolderController)
  .delete(isAuth, deleteFolderController);
folderRoutes.post('/:folderId/upload', isAuth, upload.single('file'), postUploadToFolderController);
