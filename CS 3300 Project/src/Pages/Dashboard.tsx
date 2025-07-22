import React from "react";
import MealLogger from "../components/MealLogger";
import WorkoutLogger from "../components/WorkoutLogger";
import UserLevel from "../components/userLevel.tsx";
import Achievements from "../components/Achievements";
import Messages from "../components/messages.tsx";

const Dashboard = () => {
  return (
    <div>
      <UserLevel />
      <Achievements />
      <MealLogger />
      <Messages />
      <WorkoutLogger />
    </div>
  );
};

export default Dashboard;
