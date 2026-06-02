import { useState, useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { Users, TriangleAlert, Package, MapPin, CheckCircle, Brain } from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "mobile", label: "Mobile Field App" },
  { id: "client", label: "Client Portal" },
  { id: "ai", label: "AI Insights" },
];

function DashboardTab() {
  return (
    <div style={{ background: "#111", borderRadius: 12, padding: 24, border: "1px solid #2C2C2E", minHeight: 420 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }} className="sc-stats-grid">
        {[
          { label: "Active Sites", value: "12", icon: <MapPin size={14} color="#F59E0B" /> },
          { label: "Workers Checked In", value: "247", icon: <Users size={14} color="#22C55E" /> },
          { label: "Reports Today", value: "38", icon: <CheckCircle size={14} color="#3B82F6" /> },
          { label: "AI Alerts", value: "3", icon: <TriangleAlert size={14} color="#EF4444" /> },
        ].map((s) => (
          <div key={s.label} style={{ background: "#1C1C1E", borderRadius: 10, padding: "14px 16px", border: "1px solid #2C2C2E" }}>
            <div style={{ marginBottom: 6 }}>{s.icon}</div>
            <div style={{ color: "white", fontSize: 22, fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>{s.value}</div>
            <div style={{ color: "#636366", fontSize: 11, fontFamily: "'Inter', sans-serif", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }} className="sc-map-grid">
        {/* Map area */}
        <div style={{ background: "#1C1C1E", borderRadius: 10, padding: 16, border: "1px solid #2C2C2E", minHeight: 200, position: "relative", overflow: "hidden" }}>
          <div style={{ color: "#8E8E93", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Project Map — West Africa</div>
          <svg viewBox="0 0 300 180" style={{ width: "100%", opacity: 0.8 }}>
            <rect width="300" height="180" fill="#0A0A0A" />
            {/* Grid lines */}
            {[30, 60, 90, 120, 150].map((y) => (
              <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#1C1C1E" strokeWidth="1" />
            ))}
            {[50, 100, 150, 200, 250].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="#1C1C1E" strokeWidth="1" />
            ))}
            {/* Project pins */}
            {[
              { x: 140, y: 80, label: "Lekki Ph2" },
              { x: 125, y: 95, label: "Victoria Is." },
              { x: 80, y: 100, label: "Accra Devs" },
              { x: 175, y: 110, label: "Nairobi RC" },
            ].map((pin) => (
              <g key={pin.label}>
                <circle cx={pin.x} cy={pin.y} r="5" fill="#F59E0B" opacity="0.9" />
                <circle cx={pin.x} cy={pin.y} r="9" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
                <text x={pin.x + 8} y={pin.y + 4} fontSize="8" fill="#8E8E93" fontFamily="Inter, sans-serif">{pin.label}</text>
              </g>
            ))}
          </svg>
        </div>
        {/* Side column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#1C1C1E", borderRadius: 10, padding: 14, border: "1px solid #2C2C2E" }}>
            <div style={{ color: "#8E8E93", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 10 }}>Top Sites Today</div>
            {[{ site: "Lekki Phase 2", pct: 78 }, { site: "Victoria Island", pct: 64 }, { site: "Ikeja Tower", pct: 91 }].map((s) => (
              <div key={s.site} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "white", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>{s.site}</span>
                  <span style={{ color: "#F59E0B", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>{s.pct}%</span>
                </div>
                <div style={{ height: 4, background: "#2C2C2E", borderRadius: 2 }}>
                  <div style={{ height: 4, background: "#F59E0B", borderRadius: 2, width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(239,68,68,0.08)", borderRadius: 10, padding: 14, border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ color: "#EF4444", fontSize: 11, fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>3 Alerts Pending</div>
            <div style={{ color: "#8E8E93", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>AI detected delay risks on active sites</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileTab() {
  return (
    <div style={{ display: "flex", gap: 40, justifyContent: "center", alignItems: "center", padding: "40px 0", flexWrap: "wrap" }}>
      {[
        { platform: "iOS", color: "#F59E0B", items: ["GPS Check-in", "Daily Report", "Site Photos", "Tasks"] },
        { platform: "Android", color: "#3B82F6", items: ["GPS Check-in", "Daily Report", "Offline Mode", "AI Alerts"] },
      ].map((p) => (
        <div key={p.platform} style={{ textAlign: "center" }}>
          <div style={{ color: "#8E8E93", fontSize: 12, fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>{p.platform}</div>
          <div
            style={{
              width: 200,
              background: "#111",
              borderRadius: 30,
              border: `2px solid ${p.color}30`,
              padding: "24px 16px",
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${p.color}15`,
            }}
          >
            <div style={{ background: "#1C1C1E", borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ color: p.color, fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>Buildafr</div>
              <div style={{ color: "white", fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>Lekki Phase 2</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ color: "#22C55E", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>Live · 47 workers</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {p.items.map((item) => (
                <div key={item} style={{ background: "#2C2C2E", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
                  <span style={{ color: "white", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientPortalTab() {
  return (
    <div style={{ background: "#FAFAFA", borderRadius: 12, padding: 32, minHeight: 360 }}>
      <div style={{ color: "#0A0A0A", fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>Project Overview — Lekki Phase 2</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }} className="sc-client-stats">
        {[{ label: "Overall Progress", value: "67%", color: "#F59E0B" }, { label: "Milestones Done", value: "8/12", color: "#22C55E" }, { label: "Days Remaining", value: "42", color: "#3B82F6" }].map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #E5E5EA", textAlign: "center" }}>
            <div style={{ color: s.color, fontSize: 28, fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>{s.value}</div>
            <div style={{ color: "#636366", fontSize: 12, fontFamily: "'Inter', sans-serif", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #E5E5EA" }}>
        <div style={{ color: "#0A0A0A", fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>Milestone Timeline</div>
        {[
          { name: "Foundation Complete", done: true },
          { name: "Structural Frame — Floor 1", done: true },
          { name: "Electrical Rough-In", done: true },
          { name: "Structural Frame — Floor 2", done: false, active: true },
          { name: "Roofing & Waterproofing", done: false },
        ].map((m) => (
          <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F5F5F7" }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: m.done ? "#22C55E" : m.active ? "#F59E0B" : "#E5E5EA",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              {m.done && <span style={{ color: "white", fontSize: 10 }}>✓</span>}
              {m.active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
            </div>
            <span style={{ color: m.done ? "#636366" : "#0A0A0A", fontSize: 13, fontFamily: "'Inter', sans-serif", textDecoration: m.done ? "line-through" : "none" }}>{m.name}</span>
            {m.active && <span style={{ background: "#F59E0B", color: "#0A0A0A", fontSize: 10, fontWeight: 700, fontFamily: "'Inter', sans-serif", padding: "2px 8px", borderRadius: 100, marginLeft: "auto" }}>In Progress</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AITab() {
  const CIRCUMFERENCE = 2 * Math.PI * 52;
  const RISK_PCT = 0.72;
  const STROKE_OFFSET = CIRCUMFERENCE * (1 - RISK_PCT);

  return (
    <div style={{ background: "#111", borderRadius: 12, padding: 32, minHeight: 360 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }} className="sc-ai-grid">
        {/* Gauge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ color: "#8E8E93", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>AI Risk Score — Lekki Phase 2</div>
          <svg width="160" height="160" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#2C2C2E" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="#EF4444"
              strokeWidth="8"
              strokeDasharray={`${CIRCUMFERENCE}`}
              strokeDashoffset={`${STROKE_OFFSET}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Inter, sans-serif">72%</text>
            <text x="60" y="72" textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">HIGH RISK</text>
          </svg>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {[["LOW", "#22C55E"], ["MED", "#F59E0B"], ["HIGH", "#EF4444"]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                <span style={{ color: "#8E8E93", fontSize: 10, fontFamily: "'Inter', sans-serif" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ color: "#8E8E93", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>Detected Risk Factors</div>
          {[
            { icon: <Brain size={14} color="#EF4444" />, label: "Material shortage — Block C steel", severity: "HIGH" },
            { icon: <Users size={14} color="#F59E0B" />, label: "Worker attendance dropped 22% this week", severity: "MED" },
            { icon: <Package size={14} color="#F59E0B" />, label: "Cement delivery 3 days delayed", severity: "MED" },
          ].map((risk, i) => (
            <div key={i} style={{ background: "#1C1C1E", borderRadius: 10, padding: "12px 14px", border: "1px solid #2C2C2E", display: "flex", gap: 10, alignItems: "flex-start" }}>
              {risk.icon}
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontSize: 12, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{risk.label}</div>
                <div style={{
                  display: "inline-block",
                  background: risk.severity === "HIGH" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                  color: risk.severity === "HIGH" ? "#EF4444" : "#F59E0B",
                  fontSize: 9, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                  padding: "2px 8px", borderRadius: 100,
                }}>
                  {risk.severity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "mobile": return <MobileTab />;
      case "client": return <ClientPortalTab />;
      case "ai": return <AITab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <section
      ref={ref}
      id="showcase"
      style={{ background: "#FFFFFF", padding: "clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <h2 style={{ color: "#0A0A0A", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>See Buildafr in Action</h2>
        <p style={{ color: "#636366", fontSize: 20, fontFamily: "'Inter', sans-serif" }}>Every role, every screen, every workflow.</p>
      </motion.div>

      {/* Tab pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? "#F59E0B" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "#F59E0B" : "#E5E5EA"}`,
              borderRadius: 100,
              padding: "10px 24px",
              color: activeTab === tab.id ? "#0A0A0A" : "#636366",
              fontSize: 15,
              fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ maxWidth: 1100, margin: "0 auto", background: "#F5F5F7", borderRadius: 20, padding: "clamp(16px, 3vw, 32px)", border: "1px solid #E5E5EA", overflowX: "hidden" }}
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {renderTab()}
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .sc-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sc-map-grid { grid-template-columns: 1fr !important; }
          .sc-client-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .sc-ai-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .sc-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sc-client-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
