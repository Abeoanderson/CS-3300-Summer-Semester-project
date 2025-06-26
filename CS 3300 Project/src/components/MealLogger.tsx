import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import dayjs from "dayjs";

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

type Meal = {
  id: string;
  name: string;
  type: string;
  date: string;
};

type MealForm = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

const MealLogger = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [meal, setMeal] = useState<MealForm>({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const token = localStorage.getItem("token"); // assumed token storage

  const fetchMeals = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/meals?date=${dayjs().format("YYYY-MM-DD")}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAddMeal = async () => {
    if (!meal.name) return;

    await fetch(`${API_URL}/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: meal.name,
        calories: Number(meal.calories),
        protein: Number(meal.protein),
        carbs: Number(meal.carbs),
        fat: Number(meal.fat),
        date: dayjs().format("YYYY-MM-DD"),
      }),
    });

    await fetchMeals();
    setMeal({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    const totals = meals.reduce(
      (acc, m) => {
        const parts = m.type.split(",");
        for (let part of parts) {
          if (part.includes("protein")) acc.protein += parseInt(part);
          else if (part.includes("carbs")) acc.carbs += parseInt(part);
          else if (part.includes("fat")) acc.fat += parseInt(part);
        }
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 }
    );

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
          {
            data: [totals.protein, totals.carbs, totals.fat],
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
      chartRef.current?.destroy();
    };
  }, [meals]);

  const totalCalories = meals.reduce((total, m) => {
    const match = m.type.match(/(\d+)\s*cal/);
    return total + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <section className="container py-4">
      <div className="mx-auto" style={{ maxWidth: "900px" }}>
        <div className="row g-4 align-items-start">
          <div className="col-md-6">
            <div className="bg-light p-4 rounded shadow-sm">
              <h2 className="text-primary mb-4">Log a Meal</h2>
              <form
                className="row g-2 mb-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Meal Name"
                    value={meal.name}
                    onChange={(e) => setMeal({ ...meal, name: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Calories"
                    value={meal.calories}
                    onChange={(e) =>
                      setMeal({ ...meal, calories: e.target.value })
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Protein (g)"
                    value={meal.protein}
                    onChange={(e) =>
                      setMeal({ ...meal, protein: e.target.value })
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Carbs (g)"
                    value={meal.carbs}
                    onChange={(e) =>
                      setMeal({ ...meal, carbs: e.target.value })
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Fat (g)"
                    value={meal.fat}
                    onChange={(e) => setMeal({ ...meal, fat: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleAddMeal}
                  >
                    Add Meal
                  </button>
                </div>
              </form>

              <ul className="list-group mb-3">
                {meals.map((m) => (
                  <li
                    key={m.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{m.name}</span>
                    <span className="text-muted">
                      {m.type.match(/(\d+)\s*cal/)?.[1]} cal
                    </span>
                  </li>
                ))}
              </ul>

              <h5 className="text-secondary">
                Total Calories: <span className="fw-bold">{totalCalories}</span>
              </h5>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="bg-light p-4 rounded shadow-sm d-flex justify-content-center align-items-center"
              style={{ height: "100%" }}
            >
              <div style={{ width: "100%", maxWidth: "300px" }}>
                <canvas ref={canvasRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MealLogger;
