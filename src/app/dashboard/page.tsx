import type { Metadata } from "next";
import AccountHub from "@/views/AccountHub";

export const metadata: Metadata = {
  title: "Dashboard | Samsad",
  description: "Your civic dashboard with role-aware access to projects, transparency, and activity.",
};

export default function DashboardPage() {
  return <AccountHub />;
}
