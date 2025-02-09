"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  name: string;
}
interface AuthContextType {
  user?: User;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return Cookies.get("authToken") || null;
  });

  const user = {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
  };

  const login = (newToken: string) => {
    Cookies.set("authToken", newToken, { expires: 7 }); // Token expires in 7 days
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove("authToken");
    setToken(null);
  };

  const value = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
