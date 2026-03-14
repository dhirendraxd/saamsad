const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <p className="font-display text-lg font-bold text-primary">CivicLedger</p>
            <p className="text-sm text-muted-foreground mt-2">
              A transparent public ledger of political promises and governance performance.
            </p>
          </div>
          {[
            { title: "Platform", links: ["Politicians", "Projects", "Wards", "Education"] },
            { title: "Resources", links: ["Documentation", "API", "Community", "Support"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Data Policy"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-semibold text-sm text-foreground mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-10 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CivicLedger. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
