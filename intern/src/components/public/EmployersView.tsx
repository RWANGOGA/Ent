"use client";

import React from "react";
import { useApp } from "../../context/AppContext";

export function EmployersView() {
  const { go } = useApp();

  return (
    <>
      <div className="phead">
        <div className="wrap">
          <div className="crumb">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                go("home");
              }}
              className="lbl"
            >
              Home
            </a>
            <span className="lbl">/</span>
            <span className="lbl ink">Employers</span>
          </div>
          <h1>
            Post a placement.<br />
            Receive candidates who qualify.
          </h1>
          <p>
            Set the courses, the minimum grade and the documents you need. The university verifies every file before it reaches you.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-blue"
              onClick={() => go("signin")}
            >
              Open employer dashboard
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => go("contact")}
            >
              Talk to us
            </button>
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="wrap">
          <div className="orgs">
            <div className="orgcard">
              <div className="shape"></div>
              <span className="num">01</span>
              <h3>State the bar</h3>
              <p>Courses, grade, documents, testimonial. Written once, applied to every applicant automatically.</p>
            </div>
            <div className="orgcard">
              <div className="shape"></div>
              <span className="num">02</span>
              <h3>Receive qualified files</h3>
              <p>Only students who meet the published requirements reach your shortlist. No exceptions, no guessing.</p>
            </div>
            <div className="orgcard">
              <div className="shape"></div>
              <span className="num">03</span>
              <h3>Decide faster</h3>
              <p>Structured scorecards, interview slots and a single record per candidate.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
