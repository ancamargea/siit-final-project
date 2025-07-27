import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextValue, AuthResponse, AuthStateValue } from "./types";

const AuthContext = createContext<AuthContextValue | null>(null);

const initialContextValue: AuthStateValue = {
  accessToken: null,
  user: null,
};

const storageKey = "auth";

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthStateValue>(() => {
    const fromStorage = localStorage.getItem(storageKey);
    if (!fromStorage) return initialContextValue;

    try {
      return JSON.parse(fromStorage) as AuthStateValue;
    } catch (err) {
      console.error("Failed to parse auth from localStorage", err);
      return initialContextValue;
    }
  });

  function login(value: AuthResponse) {
    setAuth(value);
    localStorage.setItem(storageKey, JSON.stringify(value));
  }

  function logout() {
    setAuth(initialContextValue);
    localStorage.removeItem(storageKey);
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken: auth.accessToken,
        user: auth.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }

  return ctx;
}
