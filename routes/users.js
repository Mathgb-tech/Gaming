const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { nome, senha } = req.body;
    const updates = {};

    if (nome) {
      updates.nome = nome;
    }

    if (senha) {
      const saltRounds = 10;
      updates.senha_hash = await bcrypt.hash(senha, saltRounds);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Nenhum dado para atualizar.' });
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, nome, email')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar perfil.', error: error.message });
    }

    res.json({ message: 'Perfil atualizado com sucesso.', user: data });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.', error: err.message });
  }
});

module.exports = router;
