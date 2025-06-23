import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./Pages/home";
import About from "./Pages/about";
import NotFound from "./Pages/notFound";
import Navbar from "./components/Navbar";
import Login from "./Pages/login";
import Signup from "./Pages/signup";

type Meal = {
  id: number;
  name: string;
  calories: number;
};

function App() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState({ name: "", calories: "" });

  useEffect(() => {
    fetch("http://localhost:3001/meals")
      .then((res) => res.json())
      .then(setMeals);
  }, []);
  const handleSubmit = async () => {
    await fetch("http://localhost:3001/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newMeal.name,
        calories: Number(newMeal.calories),
      }),
    });

    const updated = await fetch("http://localhost:3001/meals").then((res) =>
      res.json()
    );
    setMeals(updated);
    setNewMeal({ name: "", calories: "" });
  };
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
