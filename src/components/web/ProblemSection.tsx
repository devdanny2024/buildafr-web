import { motion } from "motion/react";
import { useRef } from "react";
import { useInView } from "motion/react";

const PAIN_POINTS = [
  "No real-time site visibility",
  "Ghost workers inflating payroll",
  "Material theft with no paper trail",
  "Clients left in the dark for weeks",
  "Delays only discovered when it's too late",
];

const CHAOS_NODES = [
  { label: "WhatsApp", icon: "", x: 20, y: 15, color: "#22C55E" },
  { label: "Excel", icon: "", x: 70, y: 10, color: "#3B82F6" },
  { label: "Phone", icon: "", x: 55, y: 55, color: "#8E8E93" },
  { label: "Paper", icon: "", x: 15, y: 65, color: "#F59E0B" },
  { label: "Email", icon: "", x: 78, y: 70, color: "#EF4444" },
  { label: "SMS", icon: "", x: 40, y: 82, color: "#8E8E93" },
];

const CHAOS_LINES = [
  [0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [1, 4], [0, 4],
];

export function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="problem"
      style={{
        background: "#FFFFFF",
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 4vw, 40px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "center",
        }}
        className="problem-grid"
      >
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
            The Problem
          </div>
          <h2
            style={{
              color: "#0A0A0A",
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.2,
              marginBottom: 24,
            }}
          >
            Construction in Africa runs on WhatsApp and guesswork.
          </h2>
          <p
            style={{
              color: "#636366",
              fontSize: 17,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.7,
              marginBottom: 40,
            }}
          >
            Most projects rely on phone calls, paper records, and verbal agreements. Contractors disappear. Materials vanish. Clients have no visibility. Projects run over time and over budget.
          </p>

          {/* Pain points */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PAIN_POINTS.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                style={{ display: "flex", alignItems: "center", gap: 16 }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#EF4444",
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  ✗
                </div>
                <span style={{ color: "#1C1C1E", fontSize: 16, fontFamily: "'Inter', sans-serif" }}>{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right column — chaos visualization */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0A0A0A 0%, #1C1C1E 100%)",
              borderRadius: 20,
              padding: 40,
              position: "relative",
              minHeight: 380,
              overflow: "hidden",
              border: "1px solid #2C2C2E",
            }}
          >
            <div style={{ color: "#636366", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>Without Buildafr</div>
            <div style={{ color: "white", fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: 32 }}>Disconnected chaos</div>

            {/* SVG chaos graph */}
            <div style={{ position: "relative", width: "100%", paddingBottom: "70%" }}>
              <svg
                viewBox="0 0 100 80"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              >
                {/* Connection lines */}
                {CHAOS_LINES.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={CHAOS_NODES[a].x + 4}
                    y1={CHAOS_NODES[a].y + 4}
                    x2={CHAOS_NODES[b].x + 4}
                    y2={CHAOS_NODES[b].y + 4}
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                ))}

                {/* Nodes */}
                {CHAOS_NODES.map((node) => (
                  <g key={node.label} transform={`translate(${node.x}, ${node.y})`}>
                    <circle cx="4" cy="4" r="7" fill="#2C2C2E" stroke={node.color} strokeWidth="0.8" strokeOpacity="0.5" />
                    <text x="4" y="8" textAnchor="middle" fontSize="6" fill={node.color}>{node.icon}</text>
                    <text x="4" y="16" textAnchor="middle" fontSize="4" fill="#636366" fontFamily="Inter, sans-serif">{node.label}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Overlay label */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                right: 20,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <div style={{ color: "#EF4444", fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                No single source of truth
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .problem-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
