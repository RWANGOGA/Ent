"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import { isApiEnabled } from "../../lib/api";
import { Icon, IconName } from "../icons/Icons";

type Mode = "signin" | "signup";

// Seeded demo accounts (throwaway local credentials from backend seed.py). The
// quick-fill buttons load one so the four dashboards can be explored with a real
// login rather than a fake role switch.
const DEMO: [UserRole, string, string, IconName][] = [
  ["student", "Student", "amina@makerere.ac.ug", "user"],
  ["jobseeker", "Job seeker", "brian@example.com", "brief"],
  ["employer", "Employer", "hiring@lumenlabs.example", "bldg"],
  ["admin", "University admin", "office@makerere.ac.ug", "uni"],
];

const DEMO_PASSWORD = "password123";

export function SignInView() {
  const { signIn, signUp, go } = useApp();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signin") await signIn(email.trim(), password);
      else await signUp(email.trim(), name.trim(), role, password);
      // Success navigates to the dashboard; leave `busy` set so the button
      // stays disabled until the view unmounts.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  const quickFill = (demoEmail: string) => {
    setMode("signin");
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setError(null);
  };

  const mutedNote: React.CSSProperties = {
    marginTop: "20px",
    fontSize: "11.5px",
    color: "var(--muted)",
  };

  return (
    <div className="auth">
      <div className="wrap auth-l">
        <div>
          <span className="lbl">
            {mode === "signin" ? "Sign in" : "Create account"}
          </span>
          <h1 style={{ marginTop: "12px" }}>
            {mode === "signin" ? "Welcome back" : "Join"}
            <br />
            BrighterWorks.
          </h1>
          <p>
            Your access and dashboard come from a real account. Sign in — or
            create one — and the right workspace opens.
          </p>

          {!isApiEnabled && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "12px",
                color: "var(--red)",
                lineHeight: 1.6,
              }}
            >
              The backend API isn't configured (NEXT_PUBLIC_API_BASE_URL is
              empty), so sign-in is unavailable in this static build.
            </p>
          )}

          <form
            className="form"
            onSubmit={submit}
            style={{ marginTop: "16px", display: "grid", gap: "12px" }}
          >
            {mode === "signup" && (
              <div className="field">
                <label>Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amina Nakato"
                />
              </div>
            )}
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.ac.ug"
                autoComplete="username"
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
              />
            </div>
            {mode === "signup" && (
              <div className="field">
                <label>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="student">Student</option>
                  <option value="jobseeker">Job seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
            )}
            {error && (
              <div style={{ color: "var(--red)", fontSize: "12px" }}>{error}</div>
            )}
            <button
              type="submit"
              className="btn btn-blue btn-block"
              disabled={busy || !isApiEnabled}
            >
              {busy
                ? "Please wait…"
                : mode === "signin"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            {mode === "signin" ? (
              <a
                href="#signin"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("signup");
                  setError(null);
                }}
              >
                Need an account? Create one
              </a>
            ) : (
              <a
                href="#signin"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("signin");
                  setError(null);
                }}
              >
                Already registered? Sign in
              </a>
            )}
          </div>

          {isApiEnabled && (
            <div style={{ marginTop: "22px" }}>
              <div className="lbl" style={{ marginBottom: "8px" }}>
                Or open a demo account
              </div>
              <div className="roles">
                {DEMO.map(([id, label, demoEmail, icon]) => (
                  <button
                    key={id}
                    type="button"
                    className="role"
                    onClick={() => quickFill(demoEmail)}
                  >
                    <span className="ric">
                      <Icon name={icon} size={15} />
                    </span>
                    <span>
                      <b>{label}</b>
                      <span>{demoEmail}</span>
                    </span>
                    <Icon name="arrow" size={13} />
                  </button>
                ))}
              </div>
              <div style={mutedNote}>Demo password: {DEMO_PASSWORD}</div>
            </div>
          )}
        </div>
      </div>
      <div className="auth-r">
        <span className="lbl">What the record holds</span>
        <h2>
          One student file.<br />
          Four views of it.
        </h2>
        <ul>
          <li>
            <Icon name="check" size={12} />
            <span>Placements with stated courses, grades and documents</span>
          </li>
          <li>
            <Icon name="check" size={12} />
            <span>Uploaded transcripts, IDs and testimonials, timestamped</span>
          </li>
          <li>
            <Icon name="check" size={12} />
            <span>Verification decisions with reasons attached</span>
          </li>
          <li>
            <Icon name="check" size={12} />
            <span>Placement rates by faculty and organisation type</span>
          </li>
        </ul>
        <div style={{ marginTop: "28px", display: "flex", gap: "10px" }}>
          <a
            href="#home"
            className="btn"
            style={{ borderColor: "#4A5D77", color: "#EDEAE0" }}
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
