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
    <section className="container py-4">
      <div className="mx-auto" style={{ maxWidth: "900px" }}>
        <div className="row g-4 align-items-start">
          <div className="col-md-6">
            <div className="bg-light p-4 rounded shadow-sm">
              <h2 className="text-primary mb-4">Log a Meal</h2>
              <form className="row g-2 mb-3">
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
              <div
                style={{ width: "100%", maxWidth: "300px"}}
              >
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
