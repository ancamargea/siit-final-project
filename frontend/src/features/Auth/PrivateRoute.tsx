import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user } = useAuthContext();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User does not have permission
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
