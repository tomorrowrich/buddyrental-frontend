"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export interface User {
  userId: string;
  firstname: string;
  lastname: string;
  citizenId: string;
  email: string;
  phoneNumber: string;
  verified: boolean;
  displayName: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city: string;
  zipcode: string;
  profilePicture?: string;
  description?: string;
}
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);

  async function getUser() {
    try {
      const res = await axios.get<User>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me` as string,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  }

  const login = async (newToken: string) => {
    Cookies.set("authToken", newToken, { expires: 7 }); // Token expires in 7 days
    setToken(newToken);
    const userData = await getUser();
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    Cookies.remove("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
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
