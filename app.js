import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import './config/passport.js';
import { prisma } from './lib/prisma.js';
import { authRoutes } from './routes/authRoute.js';
import { folderRoutes } from './routes/folderRoute.js';
import { publicRoutes } from './routes/publicRoute.js';

const app = express();
const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsPath = path.join(__dirname, 'public');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(assetsPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ONE_DAY = 1000 * 60 * 60 * 24;

app.use(
  session({
    cookie: { maxAge: ONE_DAY },
    secret: 'hola',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', publicRoutes);
app.use('/', authRoutes);
app.use('/folders', folderRoutes);

function startServer() {
  try {
    app.listen(PORT, error => {
      if (error) {
        console.error('Failed to start server:', error);
        throw error;
      }

      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();
