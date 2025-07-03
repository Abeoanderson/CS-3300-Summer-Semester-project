import React, { useEffect, useState } from "react";
import {
  fetchMeals,
  addMeal,
  deleteMeal,
  updateMeal,
  getStats,
} from "../utils/api.js";
import MacroChart from "./MacroChart";

const lightBlue = "#e3f2fd"; // light blue background
const greyBlue = "#90a4ae"; // greyish blue text/buttons
const darkBlue = "#1565c0"; // dark blue accent

const MealLogger = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const loadMeals = async () => {
    const data = await fetchMeals();
    setMeals(data);
  };

  const handleAddMeal = async () => {
    const { numMeals } = await getStats();
    const limit = 4 * +protein + 4 * +carbs + 9 * +fat;
    if (+calories < limit - 50 || +calories > limit + 50) {
      return alert("Calories do not match macros.");
    }
    if (numMeals > 20) {
      return alert("Cannot track more than 20 meals/day.");
    }
    await addMeal({
      name,
      calories: +calories,
      protein: +protein,
      carbs: +carbs,
      fat: +fat,
    });
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    loadMeals();
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const totals = meals.reduce(
    (totals, meal) => {
      return {
        calories: totals.calories + (meal.calories || 0),
        protein: totals.protein + (meal.protein || 0),
        carbs: totals.carbs + (meal.carbs || 0),
        fat: totals.fat + (meal.fat || 0),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div
      className="container py-5"
      style={{
        backgroundColor: lightBlue,
        minHeight: "100vh",
        borderRadius: 8,
      }}
    >
      <h2
        className="mb-5 text-center"
        style={{ color: darkBlue, fontWeight: "700", letterSpacing: 1.5 }}
      >
        Meal Logger
      </h2>

      <div
        className="card p-4 shadow-sm mb-5"
        style={{ borderRadius: 12, borderColor: greyBlue }}
      >
        <h5
          className="mb-4"
          style={{ color: darkBlue, fontWeight: 600, letterSpacing: 1 }}
        >
          Add a New Meal
        </h5>

        <div className="row gy-3 gx-3 align-items-center">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Meal Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderColor: greyBlue }}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              type="number"
              min={0}
              style={{ borderColor: greyBlue }}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Protein (g)"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              type="number"
              min={0}
              style={{ borderColor: greyBlue }}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Carbs (g)"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              type="number"
              min={0}
              style={{ borderColor: greyBlue }}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Fat (g)"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              type="number"
              min={0}
              style={{ borderColor: greyBlue }}
            />
          </div>
        </div>

        <button
          className="btn mt-4 w-100"
          style={{
            backgroundColor: darkBlue,
            color: "white",
            fontWeight: 600,
            letterSpacing: 1,
            borderRadius: 8,
          }}
          onClick={handleAddMeal}
          type="button"
        >
          Add Meal
        </button>
      </div>

      <h5
        className="mb-3"
        style={{ color: darkBlue, fontWeight: 700, letterSpacing: 1 }}
      >
        Logged Meals
      </h5>
      <div
        className="list-group mb-5 shadow-sm"
        style={{ borderRadius: 12, backgroundColor: "#f0f4f8" }}
      >
        {meals.length === 0 && (
          <div className="text-center py-4 text-muted">No meals logged yet</div>
        )}
        {meals.map((meal) => (
          <div
            className="list-group-item d-flex justify-content-between align-items-center"
            key={meal.id}
            style={{
              borderBottom: "1px solid #cfd8dc",
              backgroundColor: "white",
              borderRadius: 8,
              margin: "0.3rem 0",
            }}
          >
            <div>
              <strong style={{ color: darkBlue }}>{meal.name}</strong>
              <div className="text-muted" style={{ fontSize: 14 }}>
                {meal.calories} cal | {meal.protein}g protein | {meal.carbs}g
                carbs | {meal.fat}g fat
              </div>
            </div>
            <div>
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => updateMeal(meal.id)}
                style={{ borderColor: greyBlue, color: greyBlue }}
              >
                Update
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  deleteMeal(meal.id);
                  loadMeals();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="card p-4 shadow-sm"
        style={{ borderRadius: 12, borderColor: greyBlue }}
      >
        <h5 style={{ color: darkBlue, fontWeight: 700, letterSpacing: 1 }}>
          Totals
        </h5>
        <p
          style={{
            color: greyBlue,
            fontWeight: 500,
            fontSize: 16,
            marginBottom: 0,
          }}
        >
          Calories: <strong>{totals.calories}</strong> &nbsp;|&nbsp; Protein:{" "}
          <strong>{totals.protein}g</strong> &nbsp;|&nbsp; Carbs:{" "}
          <strong>{totals.carbs}g</strong> &nbsp;|&nbsp; Fat:{" "}
          <strong>{totals.fat}g</strong>
        </p>

        <MacroChart
          protein={totals.protein}
          carbs={totals.carbs}
          fat={totals.fat}
        />
      </div>
    </div>
  );
};

export default MealLogger;
