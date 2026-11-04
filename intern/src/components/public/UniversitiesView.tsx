"use client";

import React from "react";
import { useApp } from "../../context/AppContext";

export function UniversitiesView() {
  const { signIn, go } = useApp();

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
            <span className="lbl ink">Universities</span>
          </div>
          <h1>
            Run the placement office<br />
            from one page.
          </h1>
          <p>
            Publish placements from companies, government agencies and NGOs. Set requirements once. Verify documents. Report placement rates without a spreadsheet.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-blue"
              onClick={() => signIn("admin")}
            >
              Open the admin dashboard
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => go("contact")}
            >
              Request a demo
            </button>
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="wrap">
          <div className="orgs" style={{ borderTop: "1px solid var(--ink)" }}>
            <div className="orgcard">
              <div className="shape"></div>
              <span className="num">01</span>
              <h3>Publish</h3>
              <p>Add a placement with the organisation dropdown, eligible courses, minimum grade, document list and testimonial rule.</p>
            </div>
            <div className="orgcard">
              <div className="shape"></div>
              <span className="num">02</span>
              <h3>Verify</h3>
              <p>Students upload transcripts, IDs and recommendation letters. Your office approves or returns each file with a reason.</p>
            </div>
            <div className="orgcard">
              <div className="shape"></div>
              <span className="num">03</span>
              <h3>Report</h3>
              <p>Placement rates by faculty, organisation type and course — exported for senate papers and accreditation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="spec">
            <div className="reqcard">
              <div className="rh">
                <div>
                  <span className="lbl">Requirement set</span>
                  <h3 style={{ marginTop: "6px" }}>Software Engineering Intern</h3>
                </div>
                <span className="tg blue">Company</span>
              </div>
              <div className="reqrow" style={{ padding: "11px 12px" }}>
                <div className="k">Courses</div>
                <div className="doclist">
                  <span className="doc">Computer Science</span>
                  <span className="doc">Engineering</span>
                </div>
              </div>
              <div className="reqrow" style={{ padding: "11px 12px" }}>
                <div className="k">Grade</div>
                <div><b>CGPA 3.4+</b></div>
              </div>
              <div className="reqrow" style={{ padding: "11px 12px" }}>
                <div className="k">Documents</div>
                <div className="doclist">
                  <span className="doc">Transcript</span>
                  <span className="doc">CV</span>
                  <span className="doc">Portfolio</span>
                </div>
              </div>
              <div className="reqrow" style={{ padding: "11px 12px", borderBottom: 0 }}>
                <div className="k">Testimonial</div>
                <div>Not required</div>
              </div>
            </div>

            <div>
              <span className="lbl">Verification queue</span>
              <h2
                className="serif"
                style={{
                  fontSize: "34px",
                  lineHeight: 1.06,
                  margin: "12px 0 14px",
                }}
              >
                A record for every<br />submission.
              </h2>
              <p
                style={{
                  fontSize: "13.5px",
                  lineHeight: 1.7,
                  color: "var(--ink-2)",
                  maxWidth: "400px",
                }}
              >
                Every uploaded document is timestamped and tied to a student record. When an employer asks whether a transcript was verified, the answer is one click away.
              </p>
              <button
                type="button"
                className="btn btn-sm"
                style={{ marginTop: "16px" }}
                onClick={() => signIn("admin")}
              >
                See the dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
