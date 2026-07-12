const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// CORS: permite localhost em dev e o domínio da Vercel em prod
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:3000',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.FRONTEND_URL || null,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sem origin (ex: Postman, curl) e origins da lista
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ─── Rotas agrupadas sob /api ───────────────────────────────────────────────
const mainRouter = express.Router();

const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const usersRoutes = require('./routes/users');

mainRouter.use('/auth', authRoutes);
mainRouter.use('/games', gamesRoutes);
mainRouter.use('/users', usersRoutes);

mainRouter.get('/', (req, res) => {
  res.json({ status: 'API is running', version: '1.0.0' });
});

app.use('/api', mainRouter);

// ─── Exporta o app para uso serverless (Vercel) ────────────────────────────
module.exports = app;

// ─── Sobe o servidor apenas quando executado diretamente (dev local) ───────
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`API available at http://localhost:${port}/api`);
  });
}
