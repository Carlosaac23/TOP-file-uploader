import { prisma } from '../lib/prisma.js';

export async function getUserHomeController(req, res) {
  const user = req.user;
  const folders = await prisma.folder.findMany({ where: { userId: user.id } });

  res.render('pages/home', { user, folders });
}
