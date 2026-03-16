import { deleteFromCloudinary } from '../helpers/cloudinary.js';
import { prisma } from '../lib/prisma.js';

export async function getFileController(req, res) {
  try {
    const { fileId } = req.params;
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    console.log('Current file:', file);

    res.render('pages/fileInfo', { file });
  } catch (error) {
    console.error(error);
  }
}

export async function putEditFileController(req, res) {
  try {
    const { fileId } = req.params;
    const file = await prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.userId !== req.user.id) {
      return res.status(403).render('pages/error', { msg: 'Not allowed' });
    }

    await prisma.file.update({ where: { id: fileId }, data: { name: req.body.name } });

    res.redirect(`/files/${fileId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFileController(req, res) {
  try {
    const { fileId } = req.params;
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    console.log('File to delete:', file);

    if (!file || file.userId !== req.user.id) {
      return res.status(403).render('pages/error', { msg: 'Not allowed' });
    }

    await deleteFromCloudinary(file.key, file.resourceType);
    await prisma.file.delete({ where: { id: fileId } });

    res.redirect(`/folders/${file.folderId}`);
  } catch (error) {
    console.error(error);
  }
}
