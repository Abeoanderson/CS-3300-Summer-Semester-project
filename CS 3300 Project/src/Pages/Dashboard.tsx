import React from "react";
import MealLogger from "../components/MealLogger";
import WorkoutLogger from "../components/WorkoutLogger";
import UserLevel from "../components/UserLevel";
import Achievements from "../components/Achievements";

const Dashboard = () => {
  return (
    <div>
      <UserLevel />
      <Achievements />
      <MealLogger />
      <WorkoutLogger />
    </div>
  );
};

export default Dashboard;
