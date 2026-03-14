import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="font-display text-lg font-bold text-primary">CivicLedger</Link>
            <p className="text-sm text-muted-foreground mt-2">
              A transparent public ledger of political promises and governance performance.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground mb-3">Platform</p>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore</Link></li>
              <li><Link to="/regions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Regions</Link></li>
              <li><Link to="/education" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Education</Link></li>
              <li><Link to="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Account</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground mb-3">Resources</p>
            <ul className="space-y-2">
              {["Documentation", "API", "Community", "Support"].map((link) => (
                <li key={link}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground mb-3">Legal</p>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Data Policy"].map((link) => (
                <li key={link}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t mt-10 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CivicLedger. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
