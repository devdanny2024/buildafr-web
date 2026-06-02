import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const API = "https://api.buildafr.com/api/v1";

type Status = "verifying" | "success" | "error" | "missing";

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>(token ? "verifying" : "missing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(json.message || "Email verified successfully.");
        } else {
          setStatus("error");
          setMessage(json.message || "Verification failed. The link may have expired.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, [token]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <img src="/logo-primary.png" alt="Buildafr" style={styles.logo} />
        </div>

        {status === "verifying" && (
          <>
            <div style={styles.spinner} />
            <h2 style={styles.title}>Verifying your email…</h2>
            <p style={styles.sub}>Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ ...styles.icon, background: "#C0392B" }}>✓</div>
            <h2 style={styles.title}>Email Verified!</h2>
            <p style={styles.sub}>{message}</p>
            <p style={styles.sub}>Your account is now active. You can log in to Buildafr.</p>
            <a href="/" style={styles.btn}>Back to Home</a>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ ...styles.icon, background: "#E74C3C" }}>✕</div>
            <h2 style={styles.title}>Verification Failed</h2>
            <p style={styles.sub}>{message}</p>
            <p style={styles.sub}>Request a new verification link by registering again or contacting support.</p>
            <a href="/" style={styles.btn}>Back to Home</a>
          </>
        )}

        {status === "missing" && (
          <>
            <div style={{ ...styles.icon, background: "#95A5A6" }}>?</div>
            <h2 style={styles.title}>Invalid Link</h2>
            <p style={styles.sub}>No verification token found. Please use the link from your email.</p>
            <a href="/" style={styles.btn}>Back to Home</a>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0A0A0A",
    fontFamily: "'Inter', sans-serif",
    padding: "24px",
  },
  card: {
    background: "#111111",
    border: "1px solid #222",
    borderRadius: "16px",
    padding: "48px 40px",
    maxWidth: "440px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  logoRow: {
    marginBottom: "32px",
  },
  logo: {
    height: "56px",
    objectFit: "contain",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "3px solid #333",
    borderTop: "3px solid #C0392B",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 24px",
  },
  icon: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "white",
    margin: "0 auto 24px",
    fontWeight: "700",
  },
  title: {
    color: "#FFFFFF",
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "12px",
  },
  sub: {
    color: "#888",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "8px",
  },
  btn: {
    display: "inline-block",
    marginTop: "24px",
    padding: "12px 28px",
    background: "#C0392B",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
};
