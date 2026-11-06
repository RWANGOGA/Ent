"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";

type FooterLink =
  | { label: string; route: string }
  | { label: string; role: UserRole };

const COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Students",
    links: [
      { label: "Browse placements", route: "placements" },
      { label: "Student sign in", role: "student" },
      { label: "Job seeker sign in", role: "jobseeker" },
    ],
  },
  {
    heading: "Universities",
    links: [
      { label: "List a placement", route: "universities" },
      { label: "How verification works", route: "about" },
      { label: "Admin sign in", role: "admin" },
    ],
  },
  {
    heading: "Employers",
    links: [
      { label: "Post a placement", route: "employers" },
      { label: "Plans and pricing", route: "plans" },
      { label: "Employer sign in", role: "employer" },
    ],
  },
  {
    heading: "Office",
    links: [
      { label: "Contact", route: "contact" },
      { label: "Privacy", route: "privacy" },
      { label: "Accessibility", route: "accessibility" },
    ],
  },
];

export function Footer() {
  const { go } = useApp();
  // Hydrated from the visitor's clock; a hardcoded year silently rots.
  const [year] = useState(() => new Date().getFullYear());

  const handleLink = (link: FooterLink) => {
    if ("role" in link) go("signin");
    else go(link.route);
  };

  const backToTop = () => {
    // CSS cannot suppress a scripted scroll, so reduced-motion has to be
    // honoured here rather than relying on the prefers-reduced-motion rule.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <a
              href="#home"
              className="logo"
              style={{ marginBottom: "12px" }}
              onClick={(e) => {
                e.preventDefault();
                go("home");
              }}
            >
              <i></i>
              <span>
                <b>BrighterWorks</b>
                <small>PLACEMENT SYSTEM</small>
              </span>
            </a>
            <p>
              Placements from companies, government agencies and NGOs — listed
              by universities, with requirements stated before anyone applies.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h5>{col.heading}</h5>
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={"role" in link ? "#signin" : `#${link.route}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink(link);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>

        <div className="fbase">
          <span>
            © {year} BrighterWorks. Kampala · Nairobi · Berlin.
          </span>
          <span>
            Requirements and eligibility are set by each university.
          </span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              backToTop();
            }}
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
