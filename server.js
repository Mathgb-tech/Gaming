const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sem origin (ex: Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verifica origens permitidas dinamicamente
    const isLocalhost = origin.startsWith('http://localhost:');
    const isVercel = origin.endsWith('.vercel.app') && origin.includes('gaming');
    
    if (isLocalhost || isVercel) {
      return callback(null, true);
    } else {
      console.log(`[CORS REJECTED] Origem não permitida: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
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
