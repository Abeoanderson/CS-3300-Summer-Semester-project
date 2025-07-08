// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { loginAPI } from "../utils/api";
export type AuthContextType = {
  token: string | null;
  user: null; // update to actual user type if available
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<null>(null);

  const login = async (
    username: string,
    password: string
  ): Promise<string | null> => {
    const token = await loginAPI(username, password); // import this
    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      return token;
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
