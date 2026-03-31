import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Samsad",
  description: "Track Nepal's public promises, project delivery, and community verification.",
  icons: {
    icon: "/favicon.svg",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en-NP" suppressHydrationWarning>
      <body>
        <AppProviders>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
