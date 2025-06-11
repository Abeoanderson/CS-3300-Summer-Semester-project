import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type Meal = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

const MealLogger = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [meal, setMeal] = useState<Meal>({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleAddMeal = () => {
    if (meal.name) {
      setMeals([...meals, meal]);
      setMeal({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
          {
            data: [
              meals.reduce((a, m) => a + Number(m.protein || 0), 0),
              meals.reduce((a, m) => a + Number(m.carbs || 0), 0),
              meals.reduce((a, m) => a + Number(m.fat || 0), 0),
            ],
            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      chartRef.current?.destroy(); // cleanup on unmount
    };
  }, [meals]);

  const totalCalories = meals.reduce(
    (total, m) => total + Number(m.calories || 0),
    0
  );

  return (
    <section className="box">
      <h2>Log A Meal:</h2>
      <ul>
        {meals.map((m, index) => (
          <li key={index}>
            {m.name} - {m.calories} cal
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Meal Name"
        value={meal.name}
        onChange={(e) => setMeal({ ...meal, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Calories"
        value={meal.calories}
        onChange={(e) => setMeal({ ...meal, calories: e.target.value })}
      />
      <input
        type="number"
        placeholder="Protein (g)"
        value={meal.protein}
        onChange={(e) => setMeal({ ...meal, protein: e.target.value })}
      />
      <input
        type="number"
        placeholder="Carbs (g)"
        value={meal.carbs}
        onChange={(e) => setMeal({ ...meal, carbs: e.target.value })}
      />
      <input
        type="number"
        placeholder="Fat (g)"
        value={meal.fat}
        onChange={(e) => setMeal({ ...meal, fat: e.target.value })}
      />
      <button onClick={handleAddMeal}>Add Meal</button>
      <h3>
        Total Calories: <span>{totalCalories}</span>
      </h3>
      <div style={{ width: "400px", height: "400px" }}>
        <canvas ref={canvasRef} />
      </div>
    </section>
  );
};

export default MealLogger;
