import { uploadToCloudinary } from '../helpers/cloudinary.js';
import { prisma } from '../lib/prisma.js';

export function getFoldersController(req, res) {
  res.render('pages/createFolder');
}

export async function createFolderController(req, res) {
  try {
    const { name } = req.body;

    await prisma.folder.create({
      data: {
        name,
        userId: req.user.id,
      },
    });

    res.redirect('/home');
  } catch (error) {
    console.error(error);
  }
}

export async function getFolderController(req, res) {
  try {
    const { folderId } = req.params;
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });
    const files = await prisma.file.findMany({ where: { folderId } });
    console.log('Files from this folder:', files);

    if (!folder) {
      return res.status(404).render('pages/error', { msg: 'Folder does not exist' });
    }

    res.render('pages/folderInfo', { folder, files });
  } catch (error) {
    console.error(error);
  }
}

export async function putRenameFolderController(req, res) {
  try {
    const { folderId } = req.params;
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(403).render('pages/error', { msg: 'Not allowed' });
    }

    await prisma.folder.update({ where: { id: folderId }, data: { name: req.body.name } });

    res.redirect(`/folders/${folderId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFolderController(req, res) {
  try {
    const { folderId } = req.params;
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(403).render('pages/error', { msg: 'Not allowed' });
    }

    await prisma.folder.delete({ where: { id: folderId } });

    res.redirect('/home');
  } catch (error) {
    console.error(error);
  }
}

export async function postUploadToFolderController(req, res) {
  try {
    const { folderId } = req.params;
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(403).render('pages/error', { msg: 'Not allowed' });
    }

    const {
      secure_url: url,
      public_id: key,
      resource_type,
    } = await uploadToCloudinary(req.file.buffer);

    await prisma.file.create({
      data: {
        name: req.file.originalname,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url,
        key,
        resourceType: resource_type,
        userId: req.user.id,
        folderId,
      },
    });

    res.redirect(`/folders/${folderId}`);
  } catch (error) {
    console.error(error);
  }
}
