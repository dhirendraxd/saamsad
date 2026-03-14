import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ExplorePage from "./pages/Explore.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import RegionExplorer from "./pages/RegionExplorer.tsx";
import CivicEducation from "./pages/CivicEducation.tsx";
import AccountHub from "./pages/AccountHub.tsx";
import AuthPage from "./pages/Auth.tsx";
import About from "./pages/About.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/regions" element={<RegionExplorer />} />
              <Route path="/education" element={<CivicEducation />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/account" element={<AccountHub />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
