const LINK_COLUMNS = [
  {
    heading: "Product",
    links: ["Features", "Pricing", "How It Works", "Roadmap", "Changelog"],
  },
  {
    heading: "Company",
    links: ["About Us", "Blog", "Careers", "Press", "Contact"],
  },
  {
    heading: "Resources",
    links: ["Documentation", "API", "Case Studies", "Status Page"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Security", "GDPR"],
  },
];

const SOCIAL = ["LinkedIn", "Twitter/X", "YouTube", "Instagram"];

// Links that route to a real page; everything else stays a placeholder anchor.
const LINK_HREFS: Record<string, string> = {
  "Privacy Policy": "/privacy",
  "Terms of Service": "/terms",
};

export function Footer() {
  return (
    <footer style={{ background: "#0A0A0A", padding: "clamp(48px, 6vw, 80px) clamp(20px, 4vw, 40px) clamp(32px, 4vw, 40px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 40,
            marginBottom: 64,
          }}
          className="footer-top"
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 10 }}>
              <img src="/logo-primary.png" alt="Buildafr" style={{ height: 48, objectFit: "contain" }} />
            </div>
            <div style={{ color: "#636366", fontSize: 15, fontFamily: "'Inter', sans-serif", marginBottom: 6 }}>
              Build with Visibility. Deliver with Proof.
            </div>
            <div style={{ color: "#3A3A3C", fontSize: 13, fontFamily: "'Inter', sans-serif" }}>
              The construction operating system for Africa.
            </div>
          </div>

          {/* App store badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Download on the", store: "App Store", icon: "" },
              { label: "Get it on", store: "Google Play", icon: "" },
            ].map((b) => (
              <a
                key={b.store}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#1C1C1E",
                  border: "1px solid #2C2C2E",
                  borderRadius: 10,
                  padding: "10px 16px",
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                  minWidth: 160,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3A3A3C"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2C2C2E"; }}
              >
                <div>
                  <div style={{ color: "#8E8E93", fontSize: 10, fontFamily: "'Inter', sans-serif" }}>{b.label}</div>
                  <div style={{ color: "white", fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{b.store}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
            marginBottom: 64,
          }}
          className="footer-links"
        >
          {LINK_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 20 }}>
                {col.heading}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((link) => (
                  <a
                    key={link}
                    href={LINK_HREFS[link] ?? "#"}
                    style={{
                      color: "#636366",
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#FFFFFF"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#636366"; }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#2C2C2E", marginBottom: 32 }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ color: "#636366", fontSize: 13, fontFamily: "'Inter', sans-serif" }}>
            © 2026 Buildafr Technologies Ltd. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {SOCIAL.map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  color: "#636666",
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#FFFFFF"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#636666"; }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-top { grid-template-columns: 1fr !important; }
          .footer-links { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .footer-links { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
