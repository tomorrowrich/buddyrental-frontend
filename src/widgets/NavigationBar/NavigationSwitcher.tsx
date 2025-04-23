"use client";
import { NavigationBar } from "./NavigationBar";
import { MobileNavigationBar } from "./MobileNavigationBar";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/auth";

export default function NavigationSwitcher() {
  //adjust for mobile layout
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.admin?.adminId !== undefined;
  // console.log("admin", user?.admin);

  useEffect(() => {
    // Check screen width on mount & resize
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile ? (
    <MobileNavigationBar isAdmin={isAdmin} />
  ) : (
    <NavigationBar isAdmin={isAdmin} />
  );
}
