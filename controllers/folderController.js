import { uploadToSupabase, deleteFromSupabase, createSignedURLs } from '../helpers/supabase.js';
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

    if (!folder) {
      return res.status(404).render('pages/error', { msg: 'Folder does not exist' });
    }

    res.render('pages/folderInfo', { user: req.user, folder, files });
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

    const files = await prisma.file.findMany({ where: { folderId } });

    for (const file of files) {
      await deleteFromSupabase(file.key);
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

    const result = await uploadToSupabase(req.file, req.file.buffer);
    const { url, key } = result;

    await prisma.file.create({
      data: {
        name: req.file.originalname,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url,
        key,
        userId: req.user.id,
        folderId,
      },
    });

    res.redirect(`/folders/${folderId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function shareFolderController(req, res) {
  try {
    const { folderId } = req.params;
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(403).render('pages/error', { msg: 'Not allowed' });
    }

    const files = await prisma.file.findMany({ where: { folderId } });
    const keys = files.map(file => file.key);
    const signedURLs = await createSignedURLs(keys);

    res.render('pages/signedUrls', { user: req.user, links: signedURLs, folderId });
  } catch (error) {
    console.error(error);
  }
}
