"use client";

import React from "react";
import { useApp } from "../../context/AppContext";

export function Footer() {
  const { go } = useApp();

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <div className="logo" style={{ marginBottom: "12px" }}>
              <i></i>
              <span>
                <b>INTERN</b>
                <small>PLACEMENT SYSTEM</small>
              </span>
            </div>
            <p>
              Placements from companies, government agencies and NGOs — listed by
              universities, with requirements stated before anyone applies.
            </p>
          </div>
          <div>
            <h5>Students</h5>
            <a
              href="#placements"
              onClick={(e) => {
                e.preventDefault();
                go("placements");
              }}
            >
              Browse placements
            </a>
            <a
              href="#signin"
              onClick={(e) => {
                e.preventDefault();
                go("signin");
              }}
            >
              Student sign in
            </a>
            <a
              href="#signin"
              onClick={(e) => {
                e.preventDefault();
                go("signin");
              }}
            >
              Job seeker sign in
            </a>
          </div>
          <div>
            <h5>Universities</h5>
            <a
              href="#universities"
              onClick={(e) => {
                e.preventDefault();
                go("universities");
              }}
            >
              List a placement
            </a>
            <a
              href="#universities"
              onClick={(e) => {
                e.preventDefault();
                go("universities");
              }}
            >
              Verification
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("contact");
              }}
            >
              Request a demo
            </a>
          </div>
          <div>
            <h5>Office</h5>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                go("about");
              }}
            >
              About INTERN
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("contact");
              }}
            >
              Contact
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Accessibility
            </a>
          </div>
        </div>
        <div className="fbase">
          <span>© 2026 INTERN. Kampala · Nairobi · Berlin.</span>
          <span>Requirements and eligibility are set by each university.</span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
