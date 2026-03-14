import passport from 'passport';

import { generateHashedPassword } from '../helpers/passwords.js';
import { prisma } from '../lib/prisma.js';

export function getRegister(req, res) {
  res.render('register');
}

export async function postRegister(req, res) {
  try {
    console.log(req.body);
    await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: await generateHashedPassword(req.body.password, 12),
      },
    });

    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
}

export function getLoginController(req, res) {
  res.render('index');
}

export const postLoginController = passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/success',
});

export function logoutController(req, res) {
  req.logout(error => {
    if (error) return res.status(500).send('Logout failed');

    res.redirect('/');
  });
}

export function successController(req, res) {
  res.render('success');
}
