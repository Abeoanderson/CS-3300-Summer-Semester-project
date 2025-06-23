const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const app = express();
const db = new Database("mydb.sqlite");
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Create table if not exists
db.prepare(`CREATE TABLE IF NOT EXISTS meals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  calories INTEGER
)`).run();

// GET all meals
app.get("/meals", (req, res) => {
  const meals = db.prepare("SELECT * FROM meals").all();
  res.json(meals);
});

// POST a new meal
app.post("/meals", (req, res) => {
  const { name, calories } = req.body;
  const stmt = db.prepare("INSERT INTO meals (name, calories) VALUES (?, ?)");
  const info = stmt.run(name, calories);
  res.json({ id: info.lastInsertRowid });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});