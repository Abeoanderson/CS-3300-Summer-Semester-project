const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// Auth
export const loginAPI = async (username: string, password: string) => {
  // your login API call here
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    const data = await res.json();
    return data.token; // or whatever your backend sends
  }

  return null;
};

export const signup = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.ok;
};

export const getUser = async () => {
  const res = await fetch(`${API_BASE}/api/user`, { headers: headers() });
  return res.json();
};

// Meals
export const fetchMeals = async () => {
  const res = await fetch(`${API_BASE}/meals`, { headers: headers() });
  return res.json();
};

export const addMeal = async (meal: any) => {
  const res = await fetch(`${API_BASE}/meals`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(meal),
  });
  return res.json();
};

export const deleteMeal = async (id: number) => {
  await fetch(`${API_BASE}/meals/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
};

export const updateMeal = async (id: number) => {
  // You can pass updated values as needed
  alert('Update not implemented'); // Placeholder
};

// Workouts
export const fetchWorkouts = async () => {
  const res = await fetch(`${API_BASE}/workouts`, { headers: headers() });
  return res.json();
};

export const addWorkout = async (workout: any) => {
  const res = await fetch(`${API_BASE}/workouts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(workout),
  });
  return res.json();
};

export const deleteWorkout = async (id: number) => {
  await fetch(`${API_BASE}/workouts/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
};

export const updateWorkout = async (id: number) => {
  // Same as meals — implement if needed
  alert('Update not implemented');
};

// Stats & Achievements
export const getStats = async () => {
  const res = await fetch(`${API_BASE}/stats`, { headers: headers() });
  return res.json();
};

export const getAchievements = async () => {
  const res = await fetch(`${API_BASE}/achievements`, { headers: headers() });
  return res.json();
};
