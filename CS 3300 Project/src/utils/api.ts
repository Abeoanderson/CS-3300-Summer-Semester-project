const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// Auth
export const loginAPI = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    const data = await res.json();
    return data.token;
  }

  return null;
};

export const signup = async (username: string, password: string, role: string, coach_id: number | null = null) => {
  const res = await fetch(`${API_BASE}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role, coach_id }),
  });
  return res.ok;
};

export const getUser = async () => {
  const res = await fetch(`${API_BASE}/api/user`, { headers: headers() });
  return res.json();
};

// Meals
export const fetchMeals = async () => {
  const res = await fetch(`${API_BASE}/api/meals`, { headers: headers() });
  return res.json();
};

export const addMeal = async (meal: any) => {
  const res = await fetch(`${API_BASE}/api`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(meal),
  });
  return res.json();
};

export const deleteMeal = async (id: number) => {
  await fetch(`${API_BASE}/api/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
};

export const updateMeal = async (id: number, data: any) => {
  const res = await fetch(`${API_BASE}/api/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// Workouts
export const fetchWorkouts = async () => {
  const res = await fetch(`${API_BASE}/api/workout`, { headers: headers() });
  return res.json();
};

export const addWorkout = async (workout: any) => {
  const res = await fetch(`${API_BASE}/api/workout`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(workout),
  });
  return res.json();
};

export const deleteWorkout = async (id: number) => {
  await fetch(`${API_BASE}/api/workout/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
};

export const updateWorkout = async (id: number, data: any) => {
  const res = await fetch(`${API_BASE}/api/workout/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// Stats & Achievements
export const getStats = async () => {
  const res = await fetch(`${API_BASE}/api/checks`, { headers: headers() });
  return res.json();
};

export const getAchievements = async () => {
  const res = await fetch(`${API_BASE}/api/ach`, { headers: headers() });
  return res.json();
};

// Messages
export const fetchMessages = async () => {
  const res = await fetch(`${API_BASE}/api/messages`, { headers: headers() });
  return res.json();
};

export const sendMessage = async (recipient_id: number, content: string) => {
  const res = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ recipient_id, content }),
  });
  return res.json();
};
