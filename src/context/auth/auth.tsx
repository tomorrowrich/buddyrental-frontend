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
  getToken,
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
  token: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
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
        pathname !== "/register/verify" &&
        pathname !== "/reset" &&
        pathname !== "/register/complete" &&
        pathname !== "/app/onboard"
      ) {
        redirect("/login");
      }

      if (
        success &&
        ((user?.suspendedUntil &&
          new Date(user.suspendedUntil).getTime() > Date.now()) ||
          user?.isBanned)
      ) {
        redirect("/suspended");
      }

      if (success && !user?.verified && pathname !== "/app/verify") {
        redirect("/app/verify");
      }

      if (
        success &&
        user?.verified &&
        (pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/suspended")
      ) {
        redirect("/app");
      }

      if (
        success &&
        user?.verified &&
        user?.admin === null &&
        (pathname === "/admin/verify" ||
          pathname === "/admin/reports" ||
          pathname === "/admin/historyReport" ||
          pathname === "/admin/suspend")
      ) {
        redirect("/app");
      }

      if (success && user?.verified && pathname === "/app/verify") {
        redirect("/app/onboard");
      }
    });
  }, [pathname]);

  useEffect(() => {
    getToken().then((token) => setToken(token));
  }, [user]);

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
    token,
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
