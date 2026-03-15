import { prisma } from '../lib/prisma.js';

export async function getUserHomeController(req, res) {
  const user = req.user;
  console.log('Current user:', req.user);
  const folders = await prisma.folder.findMany({ where: { userId: user.id } });
  console.log('Folders:', folders);

  res.render('pages/home', { user, folders });
}
