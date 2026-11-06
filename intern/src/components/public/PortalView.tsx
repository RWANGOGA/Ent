"use client";

import React from "react";
import { Portal } from "../../types";
import { useApp } from "../../context/AppContext";

export function PortalView({ portal }: { portal: Portal }) {
  const { go, enterPortal } = useApp();
  const internship = portal === "internships";

  return (
    <section className="hero portal-hero">
      <div className="wrap">
        <div className="hero-copy">
          <span className="lbl blue">{internship ? "Internship portal" : "Jobs portal"}</span>
          <h1>{internship ? "Find an internship built around your next step." : "Find the work that moves your career forward."}</h1>
          <p>
            {internship
              ? "Explore verified opportunities from companies, NGOs, government agencies and university departments."
              : "Search opportunities, discover employers and manage your job applications in one place."}
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-blue"
              onClick={() => go(internship ? "placements" : "signin")}
            >
              {internship ? "Find internships" : "Start finding jobs"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => go("signin")}
            >
              Sign in
            </button>
          </div>
        </div>
        <div className="hero-side fold">
          <span className="lbl">{internship ? "For students and graduates" : "For job seekers and employers"}</span>
          <h2>{internship ? "Everything for the internship journey." : "Everything for the job journey."}</h2>
          <ul>
            <li>{internship ? "Eligibility and skills matching" : "Search and saved opportunities"}</li>
            <li>{internship ? "Applications, documents and verification" : "Applications, profiles and job alerts"}</li>
            <li>{internship ? "Support for universities and host organisations" : "Tools for employers and hiring teams"}</li>
          </ul>
        </div>
      </div>
      <div className="wrap portal-switch">
        <span className="lbl">Choose a portal</span>
        <button type="button" className={internship ? "on" : ""} onClick={() => enterPortal("internships")}>
          Internships
        </button>
        <button type="button" className={!internship ? "on" : ""} onClick={() => enterPortal("jobs")}>
          Jobs
        </button>
      </div>
    </section>
  );
}
