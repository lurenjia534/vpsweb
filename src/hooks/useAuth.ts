"use client";

import { useState, useEffect } from "react";

const USER = "admin";
const PASS = "password";
const STORAGE_KEY = "loggedIn";

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const flag = localStorage.getItem(STORAGE_KEY);
      setLoggedIn(flag === "true");
      setIsLoading(false);
    }
  }, []);

  const login = (username: string, password: string) => {
    if (username === USER && password === PASS) {
      localStorage.setItem(STORAGE_KEY, "true");
      setLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLoggedIn(false);
  };

  return { loggedIn, login, logout, isLoading };
}
