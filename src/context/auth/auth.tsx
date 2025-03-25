"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  getProfile,
  login as requestLogin,
  logout as requestLogout,
} from "@/api/auth/api";
import { User } from "@/model/user";
import { redirect, usePathname } from "next/navigation";

export interface AuthContextType {
  user: User | null;
  login: (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    options?: { redirectOnSuccess?: boolean },
  ) => Promise<{ success: boolean; error?: string } | undefined>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    getProfile().then(({ success, user }) => {
      setIsAuthenticated(success);
      setUser(user);
      if (
        !success &&
        pathname !== "/login" &&
        pathname !== "/register" &&
        pathname !== "/register/complete" &&
        pathname !== "/login/forgetpassword" &&
        pathname !== "/login/resetpassword"
      ) {
        redirect("/login");
      }

      if (user) {
        if (
          user.verified &&
          (pathname === "/app/onboard" ||
            pathname === "/login" ||
            pathname === "/register" ||
            pathname === "/auth/verify")
        ) {
          redirect("/app");
        }
      }
    });
  }, [pathname]);

  const login = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    options: { redirectOnSuccess?: boolean } = { redirectOnSuccess: true },
  ) => {
    const { success, error } = await requestLogin(email, password);

    if (success && options.redirectOnSuccess) {
      redirect("/app");
    }
    return { success, error };
  };

  const logout = async () => {
    const response = await requestLogout();
    console.log(response);
    if (response.success) {
      redirect("/login");
    }
  };

  const value = {
    login,
    logout,
    isAuthenticated,
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
