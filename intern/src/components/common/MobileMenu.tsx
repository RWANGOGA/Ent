"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../icons/Icons";

export function MobileMenu() {
  const { isMenuOpen, closeMenu, go, setType } = useApp();

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
        <button type="button" onClick={closeMenu} aria-label="Close">
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
          href="#universities"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            go("universities");
          }}
        >
          Requirements
        </a>
        <a
          href="#signin"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            go("signin");
          }}
        >
          Dashboard
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
          Post a placement
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
      </details>

      <a
        href="#plans"
        style={{
          display: "block",
          padding: "15px 0",
          borderBottom: "1px solid var(--rule)",
          fontSize: "17px",
          fontFamily: "var(--serif)",
        }}
        onClick={(e) => {
          e.preventDefault();
          closeMenu();
          go("plans");
        }}
      >
        Plans
      </a>
      <a
        href="#about"
        style={{
          display: "block",
          padding: "15px 0",
          borderBottom: "1px solid var(--rule)",
          fontSize: "17px",
          fontFamily: "var(--serif)",
        }}
        onClick={(e) => {
          e.preventDefault();
          closeMenu();
          go("about");
        }}
      >
        About
      </a>
      <a
        href="#contact"
        style={{
          display: "block",
          padding: "15px 0",
          borderBottom: "1px solid var(--rule)",
          fontSize: "17px",
          fontFamily: "var(--serif)",
        }}
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
