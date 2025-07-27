import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
