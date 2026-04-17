import type { Metadata } from "next";
import AccountHub from "@/views/AccountHub";

export const metadata: Metadata = {
  title: "Citizen Dashboard | Samsad",
  description: "Follow constituency projects, upload evidence, and verify local progress.",
};

export default function CitizenDashboardPage() {
  return <AccountHub targetRole="citizen" />;
}
