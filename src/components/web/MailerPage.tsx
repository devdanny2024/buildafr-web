import { useState, useCallback, useEffect, useRef } from "react";

const API = "https://api.buildafr.com/api/v1/mailer";
const ADMIN_KEY = "bfr_adm_2026_K9xPmQr7wNsT";

const headers = (extra: Record<string, string> = {}) => ({
  "X-Admin-Key": ADMIN_KEY,
  "Content-Type": "application/json",
  ...extra,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface Campaign {
  id: string;
  name: string;
  type: "COLD_OUTREACH" | "MARKETING";
  status: "DRAFT" | "SENDING" | "PAUSED" | "COMPLETED" | "FAILED";
  subject: string;
  senderName: string;
  senderEmail: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  notificationEmails: string[];
  createdAt: string;
  template?: { name: string } | null;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  createdAt: string;
}

interface PreviewEmail {
  email: string;
  name: string;
  subject: string;
  html: string;
}

interface MailerSettings {
  senderName: string;
  senderEmail: string;
  ratePerHour: number;
}

// ─── Shared UI Primitives ─────────────────────────────────────────────────────

const s = {
  card: { background: "#1C1C1E", border: "1px solid #2C2C2E", borderRadius: 12, padding: "20px 24px" } as React.CSSProperties,
  input: { width: "100%", height: 42, background: "#0A0A0A", border: "1px solid #2C2C2E", borderRadius: 8, padding: "0 14px", color: "#FFFFFF", fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box" } as React.CSSProperties,
  label: { color: "#8E8E93", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const, display: "block", marginBottom: 6 },
  btn: (variant: "primary" | "secondary" | "danger" = "secondary") => ({
    height: 38,
    padding: "0 16px",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    ...(variant === "primary" ? { background: "#F59E0B", color: "#0A0A0A" } :
        variant === "danger" ? { background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" } :
        { background: "#2C2C2E", color: "#FFFFFF" }),
  } as React.CSSProperties),
};

const Badge = ({ status }: { status: Campaign["status"] }) => {
  const map: Record<Campaign["status"], [string, string]> = {
    DRAFT: ["#636366", "rgba(99,99,102,0.2)"],
    SENDING: ["#F59E0B", "rgba(245,158,11,0.15)"],
    PAUSED: ["#3B82F6", "rgba(59,130,246,0.15)"],
    COMPLETED: ["#22c55e", "rgba(34,197,94,0.15)"],
    FAILED: ["#EF4444", "rgba(239,68,68,0.15)"],
  };
  const [color, bg] = map[status];
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {status}
    </span>
  );
};

const ProgressBar = ({ sent, total }: { sent: number; total: number }) => {
  const pct = total > 0 ? Math.round((sent / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#2C2C2E", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#22c55e" : "#F59E0B", borderRadius: 3, transition: "width 0.3s" }} />
      </div>
      <span style={{ color: "#8E8E93", fontSize: 12, minWidth: 36, textAlign: "right" }}>{pct}%</span>
    </div>
  );
};

// ─── Login Gate ───────────────────────────────────────────────────────────────

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== ADMIN_KEY) { setError("Incorrect admin key."); return; }
    onAuth();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "#1C1C1E", border: "1px solid #2C2C2E", borderRadius: 16, padding: 40, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/logo-primary.png" alt="Buildafr" style={{ height: 48, objectFit: "contain", marginBottom: 12 }} />
          <div style={{ color: "#636366", fontSize: 14 }}>Mailer Admin</div>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={s.label}>Admin Key</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter admin key" autoFocus
              style={{ ...s.input, border: `1.5px solid ${error ? "#EF4444" : "#2C2C2E"}` }} />
            {error && <div style={{ color: "#EF4444", fontSize: 13, marginTop: 6 }}>{error}</div>}
          </div>
          <button type="submit" style={{ ...s.btn("primary"), height: 48, fontSize: 15, fontWeight: 700 }}>Sign In →</button>
        </form>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "campaigns" | "new" | "templates" | "settings";

// ─── New Campaign Form ────────────────────────────────────────────────────────

function NewCampaignForm({ onCreated, templates, settings }: { onCreated: () => void; templates: Template[]; settings: MailerSettings | null }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "COLD_OUTREACH" as "COLD_OUTREACH" | "MARKETING",
    subject: "",
    senderName: settings?.senderName ?? "Kayode, Co-founder at Buildafr",
    senderEmail: settings?.senderEmail ?? "kayode@buildafr.com",
    notificationEmails: "",
    templateId: "",
  });

  // Sync defaults when settings load
  useEffect(() => {
    if (settings) {
      setForm(f => ({
        ...f,
        senderName: f.senderName === "Kayode, Co-founder at Buildafr" ? settings.senderName : f.senderName,
        senderEmail: f.senderEmail === "kayode@buildafr.com" ? settings.senderEmail : f.senderEmail,
      }));
    }
  }, [settings]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<PreviewEmail[] | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Please upload a CSV file"); return; }
    if (!form.name || !form.subject || !form.senderName || !form.senderEmail) { setError("All fields are required"); return; }

    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("csv", file);
      fd.append("name", form.name);
      fd.append("type", form.type);
      fd.append("subject", form.subject);
      fd.append("senderName", form.senderName);
      fd.append("senderEmail", form.senderEmail);
      const emails = form.notificationEmails.split(",").map(e => e.trim()).filter(Boolean);
      fd.append("notificationEmails", JSON.stringify(emails));
      if (form.templateId) fd.append("templateId", form.templateId);

      const res = await fetch(`${API}/campaigns`, {
        method: "POST",
        headers: { "X-Admin-Key": ADMIN_KEY },
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || `Error ${res.status}`);
      }
      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (campaignId: string) => {
    setPreviewLoading(true);
    try {
      const res = await fetch(`${API}/campaigns/${campaignId}/preview?count=2`, { headers: { "X-Admin-Key": ADMIN_KEY } });
      const d = await res.json();
      setPreview(d.data);
    } catch {
      /* ignore */
    } finally {
      setPreviewLoading(false);
    }
  };

  // suppress unused warning — handlePreview is available for future use
  void handlePreview;
  void preview;
  void previewLoading;

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>New Campaign</h2>

      <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* CSV Upload */}
        <div>
          <label style={s.label}>Apollo CSV File</label>
          <div
            onClick={() => fileRef.current?.click()}
            style={{ border: `2px dashed ${file ? "#22c55e" : "#2C2C2E"}`, borderRadius: 10, padding: "24px 20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
          >
            <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
            {file
              ? <><div style={{ color: "#22c55e", fontSize: 22, marginBottom: 4 }}>✓</div><div style={{ color: "#22c55e", fontSize: 14, fontWeight: 600 }}>{file.name}</div><div style={{ color: "#636366", fontSize: 12, marginTop: 4 }}>Click to change</div></>
              : <><div style={{ color: "#636366", fontSize: 28, marginBottom: 4 }}>↑</div><div style={{ color: "#8E8E93", fontSize: 14 }}>Click to upload CSV from Apollo</div><div style={{ color: "#636366", fontSize: 12, marginTop: 4 }}>Must include email and name columns</div></>
            }
          </div>
        </div>

        {/* Campaign Type */}
        <div>
          <label style={s.label}>Campaign Type</label>
          <div style={{ display: "flex", gap: 12 }}>
            {(["COLD_OUTREACH", "MARKETING"] as const).map(t => (
              <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                style={{ flex: 1, height: 52, border: `2px solid ${form.type === t ? "#F59E0B" : "#2C2C2E"}`, borderRadius: 10, background: form.type === t ? "rgba(245,158,11,0.1)" : "#1C1C1E", color: form.type === t ? "#F59E0B" : "#8E8E93", fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {t === "COLD_OUTREACH" ? "Cold Reach Out" : "Marketing Campaign"}
              </button>
            ))}
          </div>
          {form.type === "COLD_OUTREACH" && <div style={{ color: "#636366", fontSize: 12, marginTop: 8 }}>Claude will generate a personalized cold email per recipient asking about the waitlist.</div>}
          {form.type === "MARKETING" && <div style={{ color: "#636366", fontSize: 12, marginTop: 8 }}>Claude renders your saved template with recipient name and unsubscribe link injected.</div>}
        </div>

        {/* Name */}
        <div>
          <label style={s.label}>Campaign Name</label>
          <input value={form.name} onChange={set("name")} placeholder="e.g. Lagos Developer Outreach May 2026" style={s.input} />
        </div>

        {/* Subject */}
        <div>
          <label style={s.label}>Email Subject</label>
          <input value={form.subject} onChange={set("subject")} placeholder="e.g. Quick question about your site ops" style={s.input} />
          {form.type === "COLD_OUTREACH" && <div style={{ color: "#636366", fontSize: 11, marginTop: 4 }}>Claude may override this with a personalized subject per recipient.</div>}
        </div>

        {/* Sender */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={s.label}>Sender Name</label>
            <input value={form.senderName} onChange={set("senderName")} placeholder="Kayode, Co-founder at Buildafr" style={s.input} />
          </div>
          <div>
            <label style={s.label}>Sender Email</label>
            <input value={form.senderEmail} onChange={set("senderEmail")} placeholder="kayode@buildafr.com" style={s.input} />
          </div>
        </div>

        {/* Template (marketing only) */}
        {form.type === "MARKETING" && (
          <div>
            <label style={s.label}>Email Template</label>
            <select value={form.templateId} onChange={set("templateId")}
              style={{ ...s.input, height: 42 }}>
              <option value="">Select a saved template…</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        )}

        {/* Notification Emails */}
        <div>
          <label style={s.label}>Notification Emails (comma-separated)</label>
          <input value={form.notificationEmails} onChange={set("notificationEmails")}
            placeholder="you@buildafr.com, team@buildafr.com"
            style={s.input} />
          <div style={{ color: "#636366", fontSize: 11, marginTop: 4 }}>You'll receive an email at 50% and when the campaign completes.</div>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 16px", color: "#FCA5A5", fontSize: 13 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ ...s.btn("primary"), height: 48, fontSize: 15, fontWeight: 700, opacity: loading ? 0.6 : 1 }}>
          {loading ? "Creating Campaign…" : "Create Campaign →"}
        </button>
      </form>
    </div>
  );
}

// ─── Campaigns List ───────────────────────────────────────────────────────────

function CampaignsList({ campaigns, loading, onRefresh }: { campaigns: Campaign[]; loading: boolean; onRefresh: () => void }) {
  const [acting, setActing] = useState<string | null>(null);
  const [testMsg, setTestMsg] = useState<{ id: string; ok: boolean; text: string } | null>(null);

  const action = async (id: string, endpoint: string, method = "POST") => {
    setActing(id);
    try {
      await fetch(`${API}/campaigns/${id}/${endpoint}`, { method, headers: { "X-Admin-Key": ADMIN_KEY } });
      onRefresh();
    } finally {
      setActing(null);
    }
  };

  const sendTest = async (id: string) => {
    setActing(id);
    setTestMsg(null);
    try {
      const res = await fetch(`${API}/campaigns/${id}/test`, { method: "POST", headers: { "X-Admin-Key": ADMIN_KEY } });
      const d = await res.json();
      setTestMsg({ id, ok: res.ok, text: res.ok ? "Test sent to Soliu Olukayode ✓" : (d.message || "Failed") });
    } catch {
      setTestMsg({ id, ok: false, text: "Network error" });
    } finally {
      setActing(null);
      setTimeout(() => setTestMsg(null), 5000);
    }
  };

  const deleteC = async (id: string) => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    setActing(id);
    try {
      await fetch(`${API}/campaigns/${id}`, { method: "DELETE", headers: { "X-Admin-Key": ADMIN_KEY } });
      onRefresh();
    } finally {
      setActing(null);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#636366" }}>Loading campaigns…</div>;
  if (campaigns.length === 0) return (
    <div style={{ textAlign: "center", padding: 60, color: "#636366" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}></div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#8E8E93", marginBottom: 4 }}>No campaigns yet</div>
      <div style={{ fontSize: 14 }}>Create your first campaign using the "New Campaign" tab.</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {campaigns.map(c => (
        <div key={c.id} style={{ ...s.card, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{c.name}</span>
                <Badge status={c.status} />
                <span style={{ color: "#636366", fontSize: 11, background: "#2C2C2E", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{c.type === "COLD_OUTREACH" ? "Cold" : "Marketing"}</span>
              </div>
              <div style={{ color: "#8E8E93", fontSize: 13 }}>From: {c.senderName} · Subject: {c.subject}</div>
              <div style={{ color: "#636366", fontSize: 12, marginTop: 2 }}>
                {c.sentCount} sent · {c.failedCount} failed · {c.totalRecipients - c.sentCount - c.failedCount} pending
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
              <button onClick={() => sendTest(c.id)} disabled={acting === c.id} style={{ ...s.btn(), border: "1px solid #3B82F6", color: "#60A5FA" }}>
                {acting === c.id ? "Sending…" : "Send Test"}
              </button>
              {c.status === "DRAFT" && <button onClick={() => action(c.id, "send")} disabled={acting === c.id} style={s.btn("primary")}>▶ Send</button>}
              {c.status === "SENDING" && <button onClick={() => action(c.id, "pause")} disabled={acting === c.id} style={s.btn()}>⏸ Pause</button>}
              {c.status === "PAUSED" && <button onClick={() => action(c.id, "resume")} disabled={acting === c.id} style={s.btn("primary")}>▶ Resume</button>}
              <button onClick={() => deleteC(c.id)} disabled={acting === c.id} style={s.btn("danger")}>Delete</button>
            </div>
          </div>
          <ProgressBar sent={c.sentCount} total={c.totalRecipients} />
          {testMsg?.id === c.id && (
            <div style={{ fontSize: 13, padding: "8px 12px", borderRadius: 6, background: testMsg.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: testMsg.ok ? "#22c55e" : "#EF4444", border: `1px solid ${testMsg.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}` }}>
              {testMsg.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Templates ────────────────────────────────────────────────────────────────

function TemplatesTab({ templates, onRefresh }: { templates: Template[]; onRefresh: () => void }) {
  const [form, setForm] = useState({ name: "", subject: "", htmlContent: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Template | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.subject || !form.htmlContent) { setError("All fields required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/templates`, { method: "POST", headers: headers(), body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setForm({ name: "", subject: "", htmlContent: "" });
      onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteT = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`${API}/templates/${id}`, { method: "DELETE", headers: headers() });
    onRefresh();
  };

  return (
    <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
      {/* Create */}
      <div style={{ flex: "1 1 320px", maxWidth: 520 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Create Template</h2>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={s.label}>Template Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. May Launch Announcement" style={s.input} />
          </div>
          <div>
            <label style={s.label}>Subject Line</label>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. We built something for you" style={s.input} />
          </div>
          <div>
            <label style={s.label}>HTML Content</label>
            <div style={{ color: "#636366", fontSize: 11, marginBottom: 6 }}>Use {"{{name}}"} for recipient name, {"{{unsubscribeUrl}}"} for unsubscribe link.</div>
            <textarea value={form.htmlContent} onChange={e => setForm(f => ({ ...f, htmlContent: e.target.value }))}
              placeholder="<div>Hi {{name}}, ...</div>"
              rows={10}
              style={{ ...s.input, height: "auto", padding: "12px 14px", resize: "vertical", lineHeight: 1.5 }} />
          </div>
          {error && <div style={{ color: "#EF4444", fontSize: 13 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ ...s.btn("primary"), height: 44 }}>
            {loading ? "Saving…" : "Save Template"}
          </button>
        </form>
      </div>

      {/* List */}
      <div style={{ flex: "1 1 280px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Saved Templates ({templates.length})</h2>
        {templates.length === 0
          ? <div style={{ color: "#636366", fontSize: 14, padding: "24px 0" }}>No templates saved yet.</div>
          : templates.map(t => (
            <div key={t.id} style={{ ...s.card, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ color: "#8E8E93", fontSize: 13 }}>{t.subject}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setPreview(t === preview ? null : t)} style={s.btn()}>Preview</button>
                  <button onClick={() => deleteT(t.id)} style={s.btn("danger")}>Del</button>
                </div>
              </div>
              {preview?.id === t.id && (
                <div style={{ marginTop: 16, borderTop: "1px solid #2C2C2E", paddingTop: 16 }}>
                  <div style={{ fontSize: 11, color: "#636366", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Preview</div>
                  <div style={{ background: "#0A0A0A", borderRadius: 8, padding: 12, maxHeight: 300, overflow: "auto" }}
                    dangerouslySetInnerHTML={{ __html: t.htmlContent.replace(/\{\{name\}\}/gi, "John").replace(/\{\{unsubscribeUrl\}\}/gi, "#") }} />
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ settings, onSaved }: { settings: MailerSettings | null; onSaved: (s: MailerSettings) => void }) {
  const [form, setForm] = useState<MailerSettings>({
    senderName: settings?.senderName ?? "",
    senderEmail: settings?.senderEmail ?? "",
    ratePerHour: settings?.ratePerHour ?? 20,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.senderName || !form.senderEmail) { setError("Sender name and email are required"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API}/settings`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      const d = await res.json();
      onSaved(d.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof MailerSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: k === "ratePerHour" ? Number(e.target.value) : e.target.value }));

  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Mailer Settings</h2>
      <p style={{ color: "#636366", fontSize: 14, marginBottom: 28 }}>Defaults pre-filled in every new campaign — overridable per campaign.</p>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={s.card}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={s.label}>Default Sender Name</label>
              <input value={form.senderName} onChange={set("senderName")}
                placeholder="e.g. Kayode, Co-founder at Buildafr"
                style={s.input} />
              <div style={{ color: "#636366", fontSize: 11, marginTop: 4 }}>This is the name Claude signs cold emails with.</div>
            </div>

            <div>
              <label style={s.label}>Default Sender Email</label>
              <input value={form.senderEmail} onChange={set("senderEmail")}
                type="email"
                placeholder="e.g. kayode@buildafr.com"
                style={s.input} />
            </div>

            <div>
              <label style={s.label}>Send Rate (emails per hour)</label>
              <input value={form.ratePerHour} onChange={set("ratePerHour")}
                type="number" min={1} max={100}
                style={s.input} />
              <div style={{ color: "#636366", fontSize: 11, marginTop: 4 }}>
                Recommended: 20–50/hr for Gmail SMTP. Changes take effect on the next campaign send.
              </div>
            </div>
          </div>
        </div>

        {error && <div style={{ color: "#EF4444", fontSize: 13 }}>{error}</div>}

        <button type="submit" disabled={saving}
          style={{ ...s.btn(saved ? "secondary" : "primary"), height: 44, opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MailerPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [settings, setSettings] = useState<MailerSettings | null>(null);
  const [loadingC, setLoadingC] = useState(false);
  const [loadingT, setLoadingT] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoadingC(true);
    try {
      const res = await fetch(`${API}/campaigns`, { headers: { "X-Admin-Key": ADMIN_KEY } });
      const d = await res.json();
      setCampaigns(d.data ?? []);
    } finally {
      setLoadingC(false);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    setLoadingT(true);
    try {
      const res = await fetch(`${API}/templates`, { headers: { "X-Admin-Key": ADMIN_KEY } });
      const d = await res.json();
      setTemplates(d.data ?? []);
    } finally {
      setLoadingT(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API}/settings`, { headers: { "X-Admin-Key": ADMIN_KEY } });
      const d = await res.json();
      if (d.success) setSettings(d.data);
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchCampaigns();
    fetchTemplates();
    fetchSettings();
  }, [authed, fetchCampaigns, fetchTemplates, fetchSettings]);

  // Auto-refresh when campaigns are sending
  useEffect(() => {
    if (!authed) return;
    const sending = campaigns.some(c => c.status === "SENDING");
    if (!sending) return;
    const interval = setInterval(fetchCampaigns, 15000);
    return () => clearInterval(interval);
  }, [authed, campaigns, fetchCampaigns]);

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  const totalSent = campaigns.reduce((s, c) => s + c.sentCount, 0);
  const activeCampaigns = campaigns.filter(c => c.status === "SENDING").length;

  const tabs: { key: Tab; label: string }[] = [
    { key: "campaigns", label: `Campaigns (${campaigns.length})` },
    { key: "new", label: "+ New Campaign" },
    { key: "templates", label: `Templates (${templates.length})` },
    { key: "settings", label: "Settings" },
  ];

  void loadingT;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", fontFamily: "'Inter', sans-serif", color: "#FFFFFF" }}>
      {/* Header */}
      <div style={{ background: "#1C1C1E", borderBottom: "1px solid #2C2C2E", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/logo-primary.png" alt="Buildafr" style={{ height: 40, objectFit: "contain" }} />
          <span style={{ color: "#636366", fontSize: 14 }}>/ Mailer Admin</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/admin" style={{ color: "#636366", fontSize: 13, textDecoration: "none" }}>← Waitlist</a>
          <button onClick={fetchCampaigns} style={s.btn()}>↻ Refresh</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Campaigns", value: campaigns.length },
            { label: "Active Sending", value: activeCampaigns },
            { label: "Emails Sent", value: totalSent.toLocaleString() },
            { label: "Templates", value: templates.length },
          ].map(stat => (
            <div key={stat.label} style={s.card}>
              <div style={{ color: "#636366", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{stat.label}</div>
              <div style={{ color: "#F59E0B", fontSize: 28, fontWeight: 800 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid #2C2C2E", paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? "#F59E0B" : "#636366", borderBottom: `2px solid ${tab === t.key ? "#F59E0B" : "transparent"}`, marginBottom: -1, transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "campaigns" && <CampaignsList campaigns={campaigns} loading={loadingC} onRefresh={fetchCampaigns} />}
        {tab === "new" && <NewCampaignForm onCreated={() => { fetchCampaigns(); setTab("campaigns"); }} templates={templates} settings={settings} />}
        {tab === "templates" && <TemplatesTab templates={templates} onRefresh={fetchTemplates} />}
        {tab === "settings" && <SettingsTab settings={settings} onSaved={s => setSettings(s)} />}
      </div>
    </div>
  );
}
