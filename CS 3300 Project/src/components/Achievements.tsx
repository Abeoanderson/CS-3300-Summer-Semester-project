import React, { useEffect, useState } from "react";
import { getAchievements } from "../utils/api.jsx";
import { achievementTitles, achievementSprites } from "../utils/constants";

const Achievements = () => {
  const [achievements, setAchievements] = useState<number[]>([]);

  useEffect(() => {
    getAchievements().then(setAchievements);
  }, []);

  return (
    <div className="achievements-grid">
      {achievements.map((id) => (
        <div key={id} className="achievement-box">
          <img src={achievementSprites[id]} alt="achievement" />
          <span>{achievementTitles[id]}</span>
        </div>
      ))}
    </div>
  );
};

export default Achievements;
