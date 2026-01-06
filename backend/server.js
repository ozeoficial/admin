const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/advancedsite');

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  const count = await User.countDocuments();

  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    name,
    password: hash,
    roles: [],
  });

  if (count === 0) {
    // First user: Admin & Diretor Geral
    user.roles = ['administrador', 'diretor geral'];
  }

  await user.save();
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Credenciais Inválidas' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Credenciais Inválidas' });

  const token = jwt.sign({ userId: user._id, roles: user.roles }, 'secreta');
  res.json({ token, name: user.name, roles: user.roles });
});

app.get('/api/dashboard', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({});

  const [, token] = auth.split(' ');
  try {
    const payload = jwt.verify(token, 'secreta');
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({});
    res.json({ name: user.name, roles: user.roles });
  } catch (e) {
    res.status(401).json({});
  }
});

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
