// This is a refactored version of your Express backend with support for:
// - User roles (coach or athlete)
// - Athlete-coach relationships
// - Messages from coaches to athletes

import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = new Database("meals.db");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../html')));

// === DATABASE SETUP ===
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  level INT,
  role TEXT,
  coach_id INTEGER,
  message_ids INTEGER,
  FOREIGN KEY(coach_id) REFERENCES users(id)
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS meals (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  type TEXT,
  date TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS workouts (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  calories TEXT,
  workout TEXT,
  date TEXT
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  achievement INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER,
  recipient_id INTEGER,
  content TEXT,
  timestamp TEXT
)`).run();

// === AUTH ===
const secret = 'your-secret-key';

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const generateJWT = (user) => {
  return jwt.sign({ username: user.username, id: user.id, role: user.role }, secret, { expiresIn: '1h' });
};

// === API ===
app.post('/api/signup', async (req, res) => {
  const { username, password, role, coach_id = null } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (existing) return res.status(400).json({ message: 'Username taken' });

  const hashed = await bcrypt.hash(password, 10);
  db.prepare(`INSERT INTO users (username, password, role, coach_id, level, message_ids)
              VALUES (?, ?, ?, ?, 0, '')`).run(username, hashed, role, coach_id);
  res.status(201).json({ message: 'User created' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ message: 'Login successful', token: generateJWT(user) });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/messages', auth, (req, res) => {
  const userId = req.user.id;
  const messages = db.prepare('SELECT * FROM messages WHERE recipient_id = ? ORDER BY timestamp DESC').all(userId);
  res.json(messages);
});

app.post('/api/messages', auth, (req, res) => {
  const { recipient_id, content } = req.body;
  const sender_id = req.user.id;
  const timestamp = new Date().toISOString();

  if (!recipient_id || !content) return res.status(400).json({ error: 'Missing content or recipient' });

  const result = db.prepare(`INSERT INTO messages (sender_id, recipient_id, content, timestamp)
                             VALUES (?, ?, ?, ?)`).run(sender_id, recipient_id, content, timestamp);

  const msgId = result.lastInsertRowid;
  const user = db.prepare(`SELECT message_ids FROM users WHERE id = ?`).get(recipient_id);
  const updated = user.message_ids ? user.message_ids + ',' + msgId : '' + msgId;
  db.prepare(`UPDATE users SET message_ids = ? WHERE id = ?`).run(updated, recipient_id);

  res.status(201).json({ message: 'Message sent' });
});
app.get('/api/user', auth, (req, res) => {
  const { username, id } = req.user;

  try {
    // Get base user info
    const user = db.prepare(`
      SELECT username, level, role, coach_id FROM users WHERE id = ?
    `).get(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      username: user.username,
      level: user.level,
      role: user.role,
    };

    // If athlete, fetch coach name
    if (user.role === 'athlete' && user.coach_id) {
      const coach = db.prepare(`SELECT username FROM users WHERE id = ?`).get(user.coach_id);
      response.coachName = coach?.username || null;
    }

    // If coach, fetch athlete list
    if (user.role === 'coach') {
      const athletes = db.prepare(`SELECT username FROM users WHERE coach_id = ?`).all(id);
      response.athletes = athletes;
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(3001, () => console.log('Server running on http://localhost:3001'));
