import passport from 'passport';

import { generateHashedPassword } from '../helpers/passwords.js';
import { prisma } from '../lib/prisma.js';

export async function getIndexController(req, res) {
  try {
    const users = (await prisma.user.findMany()).length;
    const folders = (await prisma.folder.findMany()).length;
    const files = (await prisma.file.findMany()).length;

    // Files uploaded today
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const todayFiles = (
      await prisma.file.findMany({
        where: { createdAt: { gte: startOfDay, lt: endOfDay } },
      })
    ).length;

    res.render('index', { user: req.user, users, folders, files, todayFiles });
  } catch (error) {
    console.error(error);
  }
}

export async function getRegisterFormController(req, res) {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const todayUsers = (
      await prisma.user.findMany({
        where: { createdAt: { gte: startOfDay, lt: endOfDay } },
      })
    ).length;

    res.render('pages/register', { user: req.user, todayUsers });
  } catch (error) {
    console.error(error);
  }
}

export async function postRegisterController(req, res) {
  try {
    const { name, email, password } = req.body;

    await prisma.user.create({
      data: {
        name,
        email,
        password: await generateHashedPassword(password, 12),
      },
    });

    res.redirect('/login');
  } catch (error) {
    console.error(error);
  }
}

export function getLoginFormController(req, res) {
  res.render('pages/login', { user: req.user });
}

export const postLoginController = passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/home',
});

export function getLogoutController(req, res) {
  req.logout(error => {
    if (error) return res.status(500).send('Logout failed');

    res.redirect('/login');
  });
}
