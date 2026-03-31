"use client";

import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
