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
    <section className="box">
      <h2>Workouts</h2>
      <ul>
        {workouts.map((w, index) => (
          <li key={index}>
            {w.name} - {w.calories} cal
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Workout Name"
        value={workout.name}
        onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Calories Burned"
        value={workout.calories}
        onChange={(e) => setWorkout({ ...workout, calories: e.target.value })}
      />
      <button onClick={handleAddWorkout}>Add Workout</button>
      <h3>
        Total Calories Burned: <span>{totalCalories}</span>
      </h3>
    </section>
  );
};

export default WorkoutLogger;
