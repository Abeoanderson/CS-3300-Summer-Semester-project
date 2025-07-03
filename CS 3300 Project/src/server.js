import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = new Database("meals.db");

app.use(cors());
app.use(express.json());

// ==== DATABASE TABLE SETUP ====

db.prepare(`
  CREATE TABLE IF NOT EXISTS meals (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT,
    type TEXT,
    date TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    calories TEXT,
    workout TEXT,
    date TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT, 
    password TEXT, 
    level INT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    achievement INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`).run();

// ==== EXPRESS APP SETUP ====

app.use(express.json());
app.use(express.static(path.join(__dirname, '../html')));
app.use(cors());

/* const options = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem')
}; */

// ==== USER DATA LOADING ====
let users = {};
const loadUsers = () => {
  users = {};
  const rows = db.prepare("SELECT username, password, level FROM users").all();
  for (const row of rows) {
    users[row.username] = {
      password: row.password,
      level: row.level
    };
  }
};
loadUsers();

const secret = 'your-secret-key'; // Use process.env.SECRET in production

// ==== ACHIEVEMENT UTILS ====

function addAchievement(userId, achievement) {
  try {
    const existing = db.prepare(`
      SELECT achievement FROM achievements WHERE user_id = ?
    `).all(userId).map(row => row.achievement);

    if (!existing.includes(achievement)) {
      db.prepare(`
        INSERT INTO achievements (user_id, achievement)
        VALUES (?, ?)
      `).run(userId, achievement);
    }
  } catch (err) {
    console.error("Error adding achievement:", err);
  }
}

// ==== RANK MIDDLEWARE ====

const rank = (req, res, next) => {
  const { username, id } = req.user;

  const { count } = db.prepare(`
    SELECT COUNT(*) AS count FROM meals WHERE user_id = ?
  `).get(id);

  const user = db.prepare(`
    SELECT level FROM users WHERE username = ?
  `).get(username);

  let newLevel = user.level;

  if (count > 30) newLevel = 3;
  else if (count > 20) newLevel = 2;
  else if (count > 10) newLevel = 1;
  else if (count == 1) addAchievement(id, 1);
  else newLevel = 0;

  if (newLevel !== user.level) {
    db.prepare(`
      UPDATE users SET level = ? WHERE username = ?
    `).run(newLevel, username);
  }

  next();
};

// ==== AUTH MIDDLEWARE ====

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

function generateJWT(user) {
  return jwt.sign(
    { username: user.username, id: user.id },
    secret,
    { expiresIn: '1h' }
  );
}

// ==== HELPERS ====

function getNumUserMealAndWorkouts(id) {
  const { count: numMeals } = db.prepare(`
    SELECT COUNT(*) AS count FROM meals WHERE user_id = ?
  `).get(id);

  const { count: numWorkouts } = db.prepare(`
    SELECT COUNT(*) AS count FROM workouts WHERE user_id = ?
  `).get(id);

  return { numMeals, numWorkouts };
}

// ==== API ROUTES ====

app.get('/api/checks', (req, res) => {
  const { id } = req.user;
  const { numMeals, numWorkouts } = getNumUserMealAndWorkouts(id);
  res.json({ numMeals, numWorkouts });
});

app.get('/api/ach', (req, res) => {
  try {
    const achievements = db.prepare(`
      SELECT achievement FROM achievements WHERE user_id = ?
    `).all(req.user.id);
    res.json(achievements.map(row => row.achievement));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/signup', async (req, res) => {
  const { username, password, level } = req.body;
  if (!username || !password) {
    console.log("missing credential")
    return res.status(400).json({ message: 'Need to provide username and password.' });
  }

  const existingUser = db.prepare(`
    SELECT * FROM users WHERE username = ?
  `).get(username);

  if (existingUser) {
    return res.status(400).json({ message: 'Username is already taken' });
  }

  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
  db.prepare(`
    INSERT INTO users (username, password, level)
    VALUES (?, ?, ?)
  `).run(username, hashedPassword, level);

  const { id } = db.prepare(`
    SELECT id FROM users WHERE username = ?
  `).get(username);

  addAchievement(id, 0);
  res.status(201).json({ message: 'User created!' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare(`
    SELECT * FROM users WHERE username = ?
  `).get(username);

  if (user && await bcrypt.compare(password, user.password)) {
    res.status(200).json({ message: 'Login successful', token: generateJWT(user) });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

app.get('/api/user',  (req, res) => {
  console.log(req,res, "req and res")
  const user = db.prepare(`
    SELECT username, level FROM users WHERE username = ?
  `).get(req.user.username);
  res.json(user);
});

app.get('/api/meals', (req, res) => {
  const date = req.query.date || dayjs().format('YYYY-MM-DD');
  const { id } = req.user;

  try {
    const rows = db.prepare(`
      SELECT * FROM meals WHERE date = ? AND user_id = ?
    `).all(date, id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/workout',  (req, res) => {
  const date = req.query.date || dayjs().format('YYYY-MM-DD');
  const userId = req.user.id;

  try {
    const { count: numWorkouts } = db.prepare(`
      SELECT COUNT(*) AS count FROM workouts WHERE user_id = ?
    `).get(userId);

    if (numWorkouts > 0) addAchievement(userId, 2);

    const rows = db.prepare(`
      SELECT * FROM workouts WHERE date = ? AND user_id = ?
    `).all(date, userId);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/workout',  (req, res) => {
  const { calories, workout, date } = req.body;
  const workoutDate = date || dayjs().format('YYYY-MM-DD');
  const userId = req.user.id;

  if (!workout || !calories) return res.status(400).json({ error: "Invalid data" });

  try {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO workouts (id, user_id, workout, calories, date)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userId, workout, calories, workoutDate);

    res.status(201).json({ id, workout, calories, date: workoutDate });
  } catch (err) {
    res.status(500).json({ error: 'Failed to insert workout into database' });
  }
});

app.put('/api/workout/:id',  (req, res) => {
  const { id } = req.params;
  const { workout, calories } = req.body;

  if (!workout || !calories) return res.status(400).json({ error: 'Workout and calories are required' });

  const result = db.prepare(`
    UPDATE workouts SET workout = ?, calories = ?
    WHERE id = ? AND user_id = ?
  `).run(workout, calories, id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Workout not found or not authorized' });
  }

  res.json({ success: true });
});

app.delete('/api/workout/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare(`
    DELETE FROM workouts WHERE id = ? AND user_id = ?
  `).run(id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Workout not found or not authorized' });
  }

  res.json({ success: true });
});

app.post('/api', rank, (req, res) => {
  const { name, calories, protein, carbs, fat, date } = req.body;
  const mealDate = date || dayjs().format('YYYY-MM-DD');
  const { id } = req.user;

  if (!name || !calories) return res.status(400).json({ error: "Invalid data" });

  try {
    const mealId = randomUUID();
    const type = `${calories} cal, ${protein || 0}g protein, ${carbs || 0}g carbs, ${fat || 0}g fat`;

    db.prepare(`
      INSERT INTO meals (id, user_id, name, type, date)
      VALUES (?, ?, ?, ?, ?)
    `).run(mealId, id, name, type, mealDate);

    if (protein > 29) addAchievement(id, 3);
    if (calories > 2900) addAchievement(id, 4);

    res.status(201).json({ id: mealId, name, calories, protein, date: mealDate });
  } catch (err) {
    res.status(500).json({ error: 'Failed to insert meal into database' });
  }
});

app.put('/api/:id', (req, res) => {
  const { id } = req.params;
  const { calories, protein } = req.body;

  const existingMeal = db.prepare(`
    SELECT * FROM meals WHERE id = ?
  `).get(id);

  if (!existingMeal) return res.status(404).json({ error: 'Meal not found' });

  const typeParts = existingMeal.type.split(',');
  let currentCalories = 0;
  let currentProtein = 0;

  for (const part of typeParts) {
    if (/cal/.test(part)) currentCalories = parseInt(part);
    if (/protein/.test(part)) currentProtein = parseInt(part);
  }

  const newCalories = typeof calories === 'number' ? calories : currentCalories;
  const newProtein = typeof protein === 'number' ? protein : currentProtein;
  const newType = `${newCalories} cal, ${newProtein}g protein`;

  const result = db.prepare(`
    UPDATE meals SET type = ? WHERE id = ?
  `).run(newType, id);

  if (result.changes === 0) {
    return res.status(500).json({ error: 'Failed to update meal' });
  }

  res.json({ message: 'Meal updated successfully' });
});

app.delete('/api/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare(`
    DELETE FROM meals WHERE id = ?
  `).run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Meal not found' });
  }

  res.json({ message: 'Meal deleted successfully' });
});


app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
