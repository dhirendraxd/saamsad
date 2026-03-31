"use client";

import * as React from "react";
import { Navigate } from "@/lib/router";
import { useAuth } from "@/lib/auth/useAuth";

type AllowedRole = "citizen" | "politician" | "any";

interface AuthGuardProps {
  children: React.ReactNode;
  requireRole?: AllowedRole;
}

/**
 * Lightweight client-side guard to gate auth-only routes and keep role-based
 * navigation consistent. Shows a minimal shell while auth is initializing.
 */
const AuthGuard = ({ children, requireRole = "any" }: AuthGuardProps) => {
  const { isReady, isAuthenticated, role } = useAuth();

  if (!isReady) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireRole !== "any" && role !== requireRole) {
    const fallback = role === "politician" ? "/dashboard/politician" : "/dashboard/citizen";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
