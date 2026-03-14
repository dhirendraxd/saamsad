import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Link to="/" className="font-display text-lg font-bold text-foreground">CivicLedger</Link>
            <p className="text-sm text-muted-foreground mt-2">
              A transparent public ledger of political promises and governance performance.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground mb-3">Quick Links</p>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-sm text-muted-foreground transition-colors hover:text-twitter-blue">Explore</Link></li>
              <li><Link to="/regions" className="text-sm text-muted-foreground transition-colors hover:text-twitter-blue">Regions</Link></li>
              <li><Link to="/education" className="text-sm text-muted-foreground transition-colors hover:text-twitter-blue">Education</Link></li>
              <li><Link to="/account" className="text-sm text-muted-foreground transition-colors hover:text-twitter-blue">Account</Link></li>
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
