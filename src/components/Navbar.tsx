import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "@/lib/router";
import { useAuth } from "@/lib/auth/useAuth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Regions", href: "/regions" },
  { label: "Education", href: "/education" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const authHref = isAuthenticated ? "/account" : "/auth";
  const authLabel = isAuthenticated ? "Account" : "Join";

  return (
    <header className="bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-foreground">
          CivicLedger
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-twitter-blue"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="civic" size="sm" asChild>
            <Link to={authHref}>{authLabel}</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 px-6 py-4 space-y-3 backdrop-blur">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`block text-sm font-medium ${
                location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-twitter-blue"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Button variant="civic" size="sm" asChild>
              <Link to={authHref} onClick={() => setOpen(false)}>{authLabel}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
