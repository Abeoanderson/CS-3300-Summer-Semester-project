import React, { useEffect, useState } from "react";
import {
  fetchWorkouts,
  addWorkout,
  deleteWorkout,
  updateWorkout,
  getStats,
} from "../utils/api.js";

const WorkoutLogger = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");

  const loadWorkouts = async () => {
    const data = await fetchWorkouts();
    setWorkouts(data);
  };

  const handleAddWorkout = async () => {
    const { numWorkouts } = await getStats();
    if (numWorkouts > 5) {
      return alert("Cannot track more than 5 workouts/day.");
    }
    await addWorkout({ workout: name, calories: +calories });
    loadWorkouts();
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const totalCalories = workouts.reduce(
    (sum, w) => sum + (+w.calories || 0),
    0
  );

  return (
    <div>
      <h2>Workouts</h2>
      <input
        placeholder="Workout"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />
      <button onClick={handleAddWorkout}>Add Workout</button>
      <ul>
        {workouts.map((w) => (
          <li key={w.id}>
            {w.workout} - {w.calories} cal
            <button onClick={() => updateWorkout(w.id)}>Update</button>
            <button
              onClick={() => {
                deleteWorkout(w.id);
                loadWorkouts();
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>Total Calories Burned: {totalCalories}</p>
    </div>
  );
};

export default WorkoutLogger;
