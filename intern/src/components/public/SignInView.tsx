"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import { Icon, IconName } from "../icons/Icons";

export function SignInView() {
  const { signIn, go } = useApp();

  const roles: [UserRole, string, string, IconName][] = [
    ["student", "Student", "Placements, requirements and documents", "user"],
    ["jobseeker", "Job seeker", "Graduate roles beyond internships", "brief"],
    ["employer", "Employer", "Post placements and review candidates", "bldg"],
    ["admin", "University admin", "Manage placements, requirements, verification", "uni"],
  ];

  return (
    <div className="auth">
      <div className="wrap auth-l">
        <div>
          <span className="lbl">Sign in</span>
          <h1 style={{ marginTop: "12px" }}>
            Choose your<br />role to continue.
          </h1>
          <p>
            INTERN runs four separate dashboards on one placement record. Your access is set by the university.
          </p>
          <div className="roles">
            {roles.map(([id, label, desc, icon]) => (
              <button
                key={id}
                type="button"
                className="role"
                onClick={() => signIn(id)}
              >
                <span className="ric">
                  <Icon name={icon} size={15} />
                </span>
                <span>
                  <b>{label}</b>
                  <span>{desc}</span>
                </span>
                <Icon name="arrow" size={13} />
              </button>
            ))}
          </div>
          <div style={{ marginTop: "20px", fontSize: "11.5px", color: "var(--muted)" }}>
            In production this step is a university email domain check or an SSO handshake. The demo opens the dashboard directly.
          </div>
        </div>
      </div>
      <div className="auth-r">
        <span className="lbl">What the record holds</span>
        <h2>
          One student file.<br />Four views of it.
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
