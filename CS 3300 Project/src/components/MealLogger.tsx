import React, { useEffect, useState } from "react";
import {
  fetchMeals,
  addMeal,
  deleteMeal,
  updateMeal,
  getStats,
} from "../utils/api.jsx";
import MacroChart from "./MacroChart";

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
    <div>
      <h2>Meals</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />
      <input
        placeholder="Protein"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
      />
      <input
        placeholder="Carbs"
        value={carbs}
        onChange={(e) => setCarbs(e.target.value)}
      />
      <input
        placeholder="Fat"
        value={fat}
        onChange={(e) => setFat(e.target.value)}
      />
      <button onClick={handleAddMeal}>Add Meal</button>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            {meal.name} - {meal.calories} cal
            <button onClick={() => updateMeal(meal.id)}>Update</button>
            <button
              onClick={() => {
                deleteMeal(meal.id);
                loadMeals();
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>Total Calories: {totals.calories}</p>
      <MacroChart
        protein={totals.protein}
        carbs={totals.carbs}
        fat={totals.fat}
      />
    </div>
  );
};

export default MealLogger;
