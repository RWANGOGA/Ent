"use client";

import React, { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../icons/Icons";

export function MobileMenu() {
  const { isMenuOpen, closeMenu, go, setType } = useApp();

  // The desktop bar's panels close on Escape; this sheet does the same.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen, closeMenu]);

  return (
    <div className={`mmenu ${isMenuOpen ? "on" : ""}`} id="mmenu">
      <div className="m-top">
        <div className="logo">
          <i></i>
          <span>
            <b>INTERN</b>
            <small>PLACEMENT SYSTEM</small>
          </span>
        </div>
        <button type="button" onClick={closeMenu} aria-label="Close menu">
          <Icon name="x" size={18} />
        </button>
      </div>

      <details open>
        <summary>Placements</summary>
        <a
          href="#placements"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            go("placements");
          }}
        >
          All placements
        </a>
        <a
          href="#placements"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            setType("Company");
          }}
        >
          Companies
        </a>
        <a
          href="#placements"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            setType("Government");
          }}
        >
          Government agencies
        </a>
        <a
          href="#placements"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            setType("NGO");
          }}
        >
          NGOs and foundations
        </a>
        <a
          href="#placements"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            setType("University");
          }}
        >
          University departments
        </a>
      </details>

      <details>
        <summary>Universities</summary>
        <a
          href="#universities"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            go("universities");
          }}
        >
          Why INTERN
        </a>
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            go("about");
          }}
        >
          How verification works
        </a>
        <a
          href="#plans"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            go("plans");
          }}
        >
          Plans for institutions
        </a>
      </details>

      <details>
        <summary>Employers</summary>
        <a
          href="#employers"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            go("employers");
          }}
        >
          How host organisations use it
        </a>
        <a
          href="#signin"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            go("signin");
          }}
        >
          Employer sign in
        </a>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            go("contact");
          }}
        >
          Talk to the office
        </a>
      </details>

      <a
        className="plain"
        href="#plans"
        onClick={(e) => {
          e.preventDefault();
          closeMenu();
          go("plans");
        }}
      >
        Plans
      </a>
      <a
        className="plain"
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          closeMenu();
          go("about");
        }}
      >
        About
      </a>
      <a
        className="plain"
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          closeMenu();
          go("contact");
        }}
      >
        Contact
      </a>

      <div className="m-cta">
        <button
          type="button"
          className="btn btn-block"
          onClick={() => {
            closeMenu();
            go("signin");
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          className="btn btn-blue btn-block"
          onClick={() => {
            closeMenu();
            go("placements");
          }}
        >
          Browse placements
        </button>
      </div>
    </div>
  );
}
