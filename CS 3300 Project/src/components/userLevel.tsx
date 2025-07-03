import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/api";
import { levelSprites, levelTitles } from "../utils/constants";

const UserLevel = () => {
  const [level, setLevel] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUser().then((user) => {
      setLevel(user.level || 0);
      setUsername(user.username || "");
    });
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container my-4 p-4 border rounded shadow-sm bg-light text-center">
      <h4 className="mb-3">
        Welcome, <strong>{username}</strong>!
      </h4>
      <img
        src={levelSprites[level] || levelSprites[0]}
        alt={`Level ${level + 1}`}
        style={{ width: "100px", height: "100px" }}
        className="mb-2"
      />
      <h5>
        Level {level + 1}: {levelTitles[level] || levelTitles[0]}
      </h5>
      <button className="btn btn-danger mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default UserLevel;
