import { deleteFromSupabase, downloadFromSupabase } from '../helpers/supabase.js';
import { prisma } from '../lib/prisma.js';

export async function getFileController(req, res) {
  try {
    const { fileId } = req.params;
    const file = await prisma.file.findUnique({ where: { id: fileId } });

    res.render('pages/fileInfo', { user: req.user, file });
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

    if (!file || file.userId !== req.user.id) {
      return res.status(403).render('pages/error', { msg: 'Not allowed' });
    }

    await deleteFromSupabase(file.key);
    await prisma.file.delete({ where: { id: fileId } });

    res.redirect(`/folders/${file.folderId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function downloadFileController(req, res) {
  try {
    const { fileId } = req.params;
    const file = await prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.userId !== req.user.id) {
      return res.status(403).render('pages/error', { msg: 'Not allowed' });
    }

    const result = await downloadFromSupabase(file.key);
    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', file.mimeType);
    res.send(buffer);
  } catch (error) {
    console.error(error);
  }
}
