"use client";

import { useState, useEffect } from "react";
import { apiClient, ApiError } from "@/lib/api-client";

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const savedUsername = localStorage.getItem("username");
      setLoggedIn(!!token);
      setUsername(savedUsername);
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.auth.login(username, password);
      setLoggedIn(true);
      setUsername(username);
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Login failed" };
    }
  };

  const register = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.auth.register(username, password);
      setLoggedIn(true);
      setUsername(username);
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Registration failed" };
    }
  };

  const logout = () => {
    apiClient.auth.logout();
    setLoggedIn(false);
    setUsername(null);
  };

  return { loggedIn, login, register, logout, isLoading, username };
}
