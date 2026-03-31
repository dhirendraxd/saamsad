import { Link } from "@/lib/router";
import Image from "next/image";
import civicIllustration from "@/assets/civic-education-illustration.webp";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="font-display text-lg font-bold text-foreground">Samsad</Link>
            <p className="text-sm text-muted-foreground mt-2">
              A transparent public ledger for Nepal's political promises and governance performance.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground mb-3">Quick Links</p>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-sm text-muted-foreground transition-colors hover:text-twitter-blue">Explore</Link></li>
              <li><Link to="/regions" className="text-sm text-muted-foreground transition-colors hover:text-twitter-blue">Provinces</Link></li>
              <li><Link to="/education" className="text-sm text-muted-foreground transition-colors hover:text-twitter-blue">Education</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-twitter-blue">About</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-twitter-blue">Dashboard</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/education" className="block group">
              <Image
                src={civicIllustration}
                alt="Nepal civic education illustration"
                className="w-full max-w-[220px] opacity-80 group-hover:opacity-100 transition-opacity"
                sizes="220px"
              />
            </Link>
            <div>
              <p className="font-semibold text-sm text-foreground">Civic Education Hub</p>
              <p className="text-xs text-muted-foreground mt-1">Learn how Nepal's democracy, governance, and citizen rights work.</p>
              <Link to="/education" className="text-xs text-twitter-blue mt-2 inline-block hover:underline">Explore lessons →</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
