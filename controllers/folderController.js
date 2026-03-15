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

    if (!folder) {
      return res.status(404).render('pages/error', { msg: 'Folder does not exist' });
    }

    res.render('pages/folderInfo', { folder });
  } catch (error) {
    console.error(error);
  }
}

export async function getEditFolderController(req, res) {
  try {
    const { folderId } = req.params;
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });

    res.render('pages/renameFolder', { folder });
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
