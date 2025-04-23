"use client";
import { baseURL } from "@/api";
import {
  getProfile,
  getToken,
  login as requestLogin,
  logout as requestLogout,
} from "@/api/auth/api";
import { fetchNotifications, markAsRead } from "@/api/notification/api";
import { Notification, NotificationContextElement } from "@/model/notification";
import { User } from "@/model/user";
import { redirect, usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";

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
  notifications: NotificationContextElement[];
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  token: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Paths that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/register/complete",
  "/register/verify",
  "/reset",
  "/onboard",
];

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<
    NotificationContextElement[]
  >([]);
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();
  const eventSourceRef = useRef<EventSource | null>(null);
  const isInitialProfileCheck = useRef<boolean>(true);
  const previousPathname = useRef<string>(pathname);

  // Check auth status only on initial load or when auth state might change
  useEffect(() => {
    // Skip redundant profile checks when just navigating between pages
    if (
      !isInitialProfileCheck.current &&
      pathname === previousPathname.current
    ) {
      return;
    }

    previousPathname.current = pathname;

    getProfile().then(({ success, user: profileUser }) => {
      isInitialProfileCheck.current = false;

      // Only update state if something changed to avoid re-renders
      if (isAuthenticated !== success) {
        setIsAuthenticated(success);
      }

      if (JSON.stringify(user) !== JSON.stringify(profileUser)) {
        setUser(profileUser);
      }

      // Handle redirects
      if (!success && !publicPaths.includes(pathname)) {
        redirect("/login");
      }

      if (success && !profileUser?.verified && pathname !== "/verify") {
        redirect("/verify");
      }

      if (
        success &&
        profileUser?.verified &&
        (pathname === "/login" || pathname === "/register")
      ) {
        redirect("/");
      }

      if (
        success &&
        ((profileUser?.suspendedUntil &&
          new Date(profileUser.suspendedUntil).getTime() > Date.now()) ||
          profileUser?.isBanned)
      ) {
        redirect("/suspended");
      }

      if (success && profileUser?.verified && pathname === "/verify") {
        redirect("/onboard");
      }
    });
  }, [pathname, isAuthenticated, user]);

  // Fetch token and notifications only when user changes
  useEffect(() => {
    const fetchTokenAndNotifications = async () => {
      const newToken = await getToken();
      // Only update if token changed
      if (token !== newToken) {
        setToken(newToken);
      }

      if (user) {
        const res = await fetchNotifications();
        // Transform notifications with memoized callbacks
        const transformedNotifications = res.data.map((n) => ({
          notification: n,
          markAsRead: async () => {
            await markAsRead(n.id);
            setNotifications((prev) =>
              prev.map((item) =>
                item.notification.id === n.id
                  ? {
                      ...item,
                      notification: { ...item.notification, read: true },
                    }
                  : item,
              ),
            );
          },
        }));

        // Only update if notifications changed
        if (
          JSON.stringify(notifications.map((n) => n.notification)) !==
          JSON.stringify(transformedNotifications.map((n) => n.notification))
        ) {
          setNotifications(transformedNotifications);
        }
      }
    };

    fetchTokenAndNotifications();
  }, [user, notifications, token]);

  // Setup SSE connection for real-time notifications
  useEffect(() => {
    if (!user || !token) return;

    const setupSSE = () => {
      // Don't recreate if already connected with same token
      if (eventSourceRef.current) {
        return;
      }

      const url = new URL(`${baseURL}/notifications/stream`);
      url.searchParams.append("token", token);

      console.log("Connecting to SSE:", url.toString());
      eventSourceRef.current = new EventSource(url.toString(), {
        withCredentials: true,
      });

      eventSourceRef.current.onmessage = (event: MessageEvent) => {
        console.log("SSE message received:", event);
        try {
          const notification = JSON.parse(event.data) as Notification;
          setNotifications((prevNotifications) => {
            // Check if notification already exists
            if (
              prevNotifications.some(
                (n) => n.notification.id === notification.id,
              )
            ) {
              return prevNotifications;
            }

            // Limit to maximum 15 notifications
            const updatedNotifications = [
              {
                notification,
                markAsRead: async () => {
                  await markAsRead(notification.id);
                  setNotifications((prev) =>
                    prev.map((item) =>
                      item.notification.id === notification.id
                        ? {
                            ...item,
                            notification: {
                              ...item.notification,
                              read: true,
                            },
                          }
                        : item,
                    ),
                  );
                },
              },
              ...prevNotifications,
            ].slice(0, 15);

            return updatedNotifications;
          });
        } catch (error) {
          console.error("Error parsing SSE notification data:", error);
        }
      };

      eventSourceRef.current.onerror = (error: Event) => {
        console.error("SSE connection error:", error);
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
          console.log(
            "SSE connection closed due to error, attempting reconnect in 1s",
          );
          setTimeout(setupSSE, 1000);
        }
      };
    };

    setupSSE();

    return () => {
      if (eventSourceRef.current) {
        console.log("Cleaning up SSE connection");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [user?.userId, user, token]); // Only recreate when user ID or token actually changes

  // Memoize login function to prevent unnecessary re-renders
  const login = useCallback(
    async (
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
        redirect("/");
      }
      return { success, error };
    },
    [],
  );

  // Memoize logout function to prevent unnecessary re-renders
  const logout = useCallback(async () => {
    const response = await requestLogout();
    console.log(response);
    if (response.success) {
      redirect("/login");
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
      notifications,
      user,
      token,
    }),
    [login, logout, isAuthenticated, notifications, user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
