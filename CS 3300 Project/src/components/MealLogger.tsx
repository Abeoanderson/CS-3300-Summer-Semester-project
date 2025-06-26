import { useState, useEffect, useRef } from "react";
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

  const handleAddMeal = async () => {
    if (!meal.name) return;

    await fetch("http://localhost:3001/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: meal.name,
        calories: Number(meal.calories),
        protein: Number(meal.protein),
        carbs: Number(meal.carbs),
        fat: Number(meal.fat),
      }),
    });

    const updated = await fetch("http://localhost:3001/meals").then((res) =>
      res.json()
    );
    setMeals(updated);
    setMeal({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  };

  useEffect(() => {
    fetch("http://localhost:3001/meals")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched meals:", data);
        setMeals(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const totalProtein = meals.reduce((a, m) => a + Number(m.protein || 0), 0);
    const totalCarbs = meals.reduce((a, m) => a + Number(m.carbs || 0), 0);
    const totalFat = meals.reduce((a, m) => a + Number(m.fat || 0), 0);

    const hasData = totalProtein + totalCarbs + totalFat > 0;

    if (!hasData) {
      console.log("No chart data to display.");
      return;
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
          {
            data: [totalProtein, totalCarbs, totalFat],
            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [meals]);

  const totalCalories = meals.reduce(
    (total, m) => total + Number(m.calories || 0),
    0
  );

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
                {meals.map((m, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{m.name}</span>
                    <span className="text-muted">{m.calories} cal</span>
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
