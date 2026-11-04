"use client";

import React from "react";
import { useApp } from "../../context/AppContext";

export function Header() {
  const { go, setType, openMenu } = useApp();

  return (
    <>
      <div className="util">
        <div className="wrap">
          <span>Placement office in software · 41 universities · 620 employers and agencies</span>
          <div className="u-r">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("contact");
              }}
            >
              Contact the office
            </a>
            <a
              href="#signin"
              onClick={(e) => {
                e.preventDefault();
                go("signin");
              }}
            >
              Sign in
            </a>
          </div>
        </div>
      </div>

      <header className="hdr">
        <div className="wrap">
          <a
            href="#home"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
          >
            <i></i>
            <span>
              <b>INTERN</b>
              <small>PLACEMENT SYSTEM</small>
            </span>
          </a>

          <ul className="nav">
            <li>
              <button type="button" aria-haspopup="true">
                Placements <span className="caret"></span>
              </button>
              <div className="menu">
                <div className="m-h lbl">Browse the index</div>
                <a
                  href="#placements"
                  onClick={(e) => {
                    e.preventDefault();
                    go("placements");
                  }}
                >
                  All placements
                </a>
                <a
                  href="#placements"
                  onClick={(e) => {
                    e.preventDefault();
                    setType("Company");
                  }}
                >
                  Companies
                </a>
                <a
                  href="#placements"
                  onClick={(e) => {
                    e.preventDefault();
                    setType("Government");
                  }}
                >
                  Government agencies
                </a>
                <a
                  href="#placements"
                  onClick={(e) => {
                    e.preventDefault();
                    setType("NGO");
                  }}
                >
                  NGOs and foundations
                </a>
                <a
                  href="#placements"
                  onClick={(e) => {
                    e.preventDefault();
                    setType("University");
                  }}
                >
                  University departments
                </a>
              </div>
            </li>
            <li>
              <button type="button" aria-haspopup="true">
                Universities <span className="caret"></span>
              </button>
              <div className="menu">
                <div className="m-h lbl">For the placement office</div>
                <a
                  href="#universities"
                  onClick={(e) => {
                    e.preventDefault();
                    go("universities");
                  }}
                >
                  Why INTERN
                </a>
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
                  Requirements &amp; verification
                </a>
                <a
                  href="#signin"
                  onClick={(e) => {
                    e.preventDefault();
                    go("signin");
                  }}
                >
                  Open dashboard
                </a>
              </div>
            </li>
            <li>
              <button type="button" aria-haspopup="true">
                Employers <span className="caret"></span>
              </button>
              <div className="menu">
                <div className="m-h lbl">For host organisations</div>
                <a
                  href="#employers"
                  onClick={(e) => {
                    e.preventDefault();
                    go("employers");
                  }}
                >
                  Post a placement
                </a>
                <a
                  href="#employers"
                  onClick={(e) => {
                    e.preventDefault();
                    go("employers");
                  }}
                >
                  How candidates arrive
                </a>
                <a
                  href="#signin"
                  onClick={(e) => {
                    e.preventDefault();
                    go("signin");
                  }}
                >
                  Employer sign in
                </a>
              </div>
            </li>
            <li>
              <a
                href="#plans"
                onClick={(e) => {
                  e.preventDefault();
                  go("plans");
                }}
              >
                Plans
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  go("about");
                }}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("contact");
                }}
              >
                Contact
              </a>
            </li>
          </ul>

          <div className="hdr-actions">
            <a
              href="#signin"
              className="btn btn-sm btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                go("signin");
              }}
            >
              Sign in
            </a>
            <a
              href="#signin"
              className="btn btn-sm btn-blue"
              onClick={(e) => {
                e.preventDefault();
                go("signin");
              }}
            >
              List a placement
            </a>
            <button
              type="button"
              className="burger"
              onClick={openMenu}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
