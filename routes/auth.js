const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';

router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, aceite_lgpd } = req.body;

    if (!aceite_lgpd) {
      return res.status(400).json({ message: 'O aceite da LGPD é obrigatório.' });
    }

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    const saltRounds = 10;
    const senha_hash = await bcrypt.hash(senha, saltRounds);

    const { data, error } = await supabase
      .from('users')
      .insert([
        { nome, email, senha_hash, aceite_lgpd }
      ])
      .select('id, nome, email')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
    }

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: data });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const validPassword = await bcrypt.compare(senha, user.senha_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: 'Login realizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.', error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado.' });
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nome, email, aceite_lgpd, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.', error: err.message });
  }
});

module.exports = router;
