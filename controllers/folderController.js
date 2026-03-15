import { prisma } from '../lib/prisma.js';

export function getFolderController(req, res) {
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
