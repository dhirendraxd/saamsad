import type { Metadata } from "next";
import AccountHub from "@/views/AccountHub";

export const metadata: Metadata = {
  title: "Politician Dashboard | Samsad",
  description: "Track promises, share transparency documents, and engage your constituency.",
};

export default function PoliticianDashboardPage() {
  return <AccountHub targetRole="politician" />;
}
