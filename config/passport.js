import passport from 'passport';
import { Strategy } from 'passport-local';

import { validateHashedPassword } from '../helpers/passwords.js';
import { prisma } from '../lib/prisma.js';

export async function verifyCallback(email, password, done) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return done(null, false);
    }

    const isValid = await validateHashedPassword(password, user.password);

    if (!isValid) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

const strategy = new Strategy(
  { usernameField: 'email', passwordField: 'password' },
  verifyCallback
);
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
