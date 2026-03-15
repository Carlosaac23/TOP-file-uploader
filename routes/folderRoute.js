import { Router } from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

import { getFolderController, createFolderController } from '../controllers/folderController.js';
import isAuth from '../middleware/auth.js';

export const folderRoutes = Router();

folderRoutes
  .route('/')
  .get(isAuth, getFolderController)
  .post(isAuth, upload.single('file'), createFolderController);
folderRoutes.route('/:folderId').get(isAuth, getFolderController);
