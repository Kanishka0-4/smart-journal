const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'journal';

const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

let db;
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ JWT Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Format: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // attaches { userId, email }
    next();
  });
}

// ✅ Signup route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Missing fields' });

  const users = db.collection('users');
  const existing = await users.findOne({ email });
  if (existing)
    return res.status(400).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  await users.insertOne({ name, email, password: hashed });

  res.status(201).json({ message: 'User created' });
});

// ✅ Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Missing fields' });

  const users = db.collection('users');
  const user = await users.findOne({ email });
  if (!user)
    return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(400).json({ message: 'Invalid credentials' });

  // ✅ Create JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.status(200).json({ message: 'Login successful', token });
});

// ✅ Protected Route Example
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Hello user ${req.user.userId}, your email is ${req.user.email}` });
});
