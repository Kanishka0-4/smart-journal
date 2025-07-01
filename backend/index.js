require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

let db;
MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db(); // You can specify your DB name if needed: client.db("smart-journal")
    app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ✅ Signup Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Missing fields' });

  const users = db.collection('users');
  const existing = await users.findOne({ email });
  if (existing)
    return res.status(400).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const result = await users.insertOne({ name, email, password: hashed });

  const token = jwt.sign(
    { userId: result.insertedId, email, name },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.status(201).json({ message: 'User created', token });
});

// ✅ Login Route
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

  const token = jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.status(200).json({ message: 'Login successful', token });
});

// ✅ Get Journal Entries (sorted by newest first)
app.get('/api/entries', authenticateToken, async (req, res) => {
  try {
    const entries = await db.collection('entries').find({
      userId: new ObjectId(req.user.userId)
    })
    .sort({ createdAt: -1 }) // newest first
    .toArray();

    res.json({ entries });
  } catch (err) {
    console.error("❌ Error fetching entries:", err);
    res.status(500).json({ message: "Error fetching entries" });
  }
});

// ✅ Save New Journal Entry (with title)
app.post('/api/entries', authenticateToken, async (req, res) => {
  try {
    const { text, title } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Entry cannot be empty" });
    }

    const entry = {
      userId: new ObjectId(req.user.userId),
      title: title?.trim() || "Untitled Entry",
      text: text.trim(),
      createdAt: new Date()
    };

    const result = await db.collection('entries').insertOne(entry);
    res.status(201).json({ message: "Entry saved", entryId: result.insertedId });
  } catch (err) {
    console.error("❌ Error saving entry:", err);
    res.status(500).json({ message: "Error saving entry" });
  }
});

// ✅ Dashboard Example Route
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Hello user ${req.user.userId}, your email is ${req.user.email}` });
});

// ✅ Profile Info Route
app.get('/api/profile', authenticateToken, async (req, res) => {
  res.json({
    userId: req.user.userId,
    email: req.user.email,
    name: req.user.name
  });
});

// ✅ Daily Quiz Submission
app.post("/api/quiz", authenticateToken, async (req, res) => {
  const { mood, healthIssues, tookCare, eatingHabit } = req.body;

  if (!mood || !eatingHabit || typeof tookCare === "undefined") {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const quiz = {
      userId: new ObjectId(req.user.userId),
      mood,
      healthIssues,
      tookCare,
      eatingHabit,
      date: new Date(),
    };

    await db.collection("quizzes").insertOne(quiz);
    res.status(201).json({ message: "Quiz submitted successfully" });
  } catch (err) {
    console.error("❌ Error saving quiz:", err);
    res.status(500).json({ message: "Error saving quiz" });
  }
});

// ✅ Get a single entry
app.get('/api/entries/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await db.collection('entries').findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.userId)
    });

    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (err) {
    console.error("❌ Error fetching entry:", err);
    res.status(500).json({ message: "Error fetching entry" });
  }
});

// ✅ Edit/Update entry
app.put('/api/entries/:id', authenticateToken, async (req, res) => {
  const { text, title } = req.body;

  if (!text?.trim() || !title?.trim()) {
    return res.status(400).json({ message: "Text and title are required" });
  }

  try {
    const result = await db.collection('entries').updateOne(
      { _id: new ObjectId(req.params.id), userId: new ObjectId(req.user.userId) },
      { $set: { text: text.trim(), title: title.trim(), updatedAt: new Date() } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Entry not found or unauthorized" });

    res.json({ message: "Entry updated" });
  } catch (err) {
    console.error("❌ Error updating entry:", err);
    res.status(500).json({ message: "Error updating entry" });
  }
});

// ✅ Delete entry
app.delete('/api/entries/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.collection('entries').deleteOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.userId)
    });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Entry not found or unauthorized" });

    res.json({ message: "Entry deleted" });
  } catch (err) {
    console.error("❌ Error deleting entry:", err);
    res.status(500).json({ message: "Error deleting entry" });
  }
});
