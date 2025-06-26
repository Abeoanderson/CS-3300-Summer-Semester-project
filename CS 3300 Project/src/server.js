import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
const db = new Database("meals.db");

app.use(cors());
app.use(express.json());

// Create meals table with all fields
db.prepare(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    calories INTEGER,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER
  )
`).run();

// Get all meals
app.get("/meals", (req, res) => {
  const meals = db.prepare("SELECT * FROM meals").all();
  res.json(meals);
});

// Add a new meal
app.post("/meals", (req, res) => {
  const { name, calories, protein, carbs, fat } = req.body;
  const stmt = db.prepare(`
    INSERT INTO meals (name, calories, protein, carbs, fat)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(name, calories, protein, carbs, fat);
  res.json({ id: info.lastInsertRowid });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
