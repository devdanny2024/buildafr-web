import { useEffect } from "react";
import { Link } from "react-router";
import { Footer } from "./Footer";

type Section = { heading: string; body: React.ReactNode };

export function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: Section[];
}) {
  // Static content pages should always open at the top.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
      {/* Top bar */}
      <header
        style={{
          height: 80,
          borderBottom: "1px solid #E5E5EA",
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(20px, 4vw, 40px)",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo-primary.png" alt="Buildafr" style={{ height: 96, objectFit: "contain" }} />
        </Link>
      </header>

      {/* Content */}
      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 72px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px)",
        }}
      >
        <h1
          style={{
            color: "#0A0A0A",
            fontSize: "clamp(32px, 5vw, 44px)",
            fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {title}
        </h1>
        <div
          style={{
            color: "#8E8E93",
            fontSize: 14,
            fontFamily: "'Inter', sans-serif",
            marginTop: 12,
            marginBottom: 32,
          }}
        >
          Last updated: {lastUpdated}
        </div>

        <p style={legalBodyStyle}>{intro}</p>

        {sections.map((s, i) => (
          <section key={s.heading} style={{ marginTop: i === 0 ? 40 : 36 }}>
            <h2
              style={{
                color: "#0A0A0A",
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.01em",
                margin: "0 0 12px",
              }}
            >
              {i + 1}. {s.heading}
            </h2>
            <div style={legalBodyStyle}>{s.body}</div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}

const legalBodyStyle: React.CSSProperties = {
  color: "#3A3A3C",
  fontSize: 16,
  lineHeight: 1.7,
  fontFamily: "'Inter', sans-serif",
  margin: 0,
};
