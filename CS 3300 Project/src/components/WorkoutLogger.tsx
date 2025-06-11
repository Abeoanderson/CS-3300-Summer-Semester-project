import React, { useState } from "react";

type Workout = {
  name: string;
  calories: string;
};
const WorkoutLogger = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workout, setWorkout] = useState<Workout>({ name: "", calories: "" });

  const handleAddWorkout = () => {
    if (workout.name) {
      setWorkouts([...workouts, workout]);
      setWorkout({ name: "", calories: "" });
    }
  };

  const totalCalories = workouts.reduce(
    (t, w) => t + Number(w.calories || 0),
    0
  );

  return (
    <section className="container py-4">
      <div className="row g-4 align-items-start">
        <div className="col-md-6">
          <div className="bg-light p-4 rounded shadow-sm">
            <h2 className="text-primary mb-4">Workouts</h2>
            <ul>
              {workouts.map((w, index) => (
                <li key={index}>
                  {w.name} - {w.calories} cal
                </li>
              ))}
            </ul>
            <div className="col-12">
              <input
                type="text"
                className="form-control"
                placeholder="Workout Name"
                value={workout.name}
                onChange={(e) =>
                  setWorkout({ ...workout, name: e.target.value })
                }
              />
            </div>
            <div className="col-12">
              <input
                type="number"
                className="form-control"
                placeholder="Calories Burned"
                value={workout.calories}
                onChange={(e) =>
                  setWorkout({ ...workout, calories: e.target.value })
                }
              />
            </div>
            <div>
              <button
                className="btn btn-primary w-100 "
                onClick={handleAddWorkout}
              >
                Add Workout
              </button>
            </div>
            <h5 className="text-secondary">
              Total Calories Burned: <span>{totalCalories}</span>
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkoutLogger;
