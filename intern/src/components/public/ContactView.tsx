"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

export function ContactView() {
  const { go, toast } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [roleType, setRoleType] = useState("Placement officer");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Message sent · the office replies within one working day");
    setFullName("");
    setEmail("");
    setOrg("");
    setMessage("");
  };

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
            <span className="lbl ink">Contact</span>
          </div>
          <h1>Contact the office</h1>
          <p>
            For universities onboarding a placement office, or employers listing government and NGO placements.
          </p>
        </div>
      </div>

      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr .8fr",
            gap: "36px",
            padding: "32px 0 60px",
          }}
          className="contact-grid"
        >
          <div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="row2">
                <div className="field">
                  <label>Full name</label>
                  <input
                    placeholder="Amina Nakato"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@university.ac.ug"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row2">
                <div className="field">
                  <label>University or organisation</label>
                  <input
                    placeholder="Makerere University"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>I am a</label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                  >
                    <option>Placement officer</option>
                    <option>Student</option>
                    <option>Employer</option>
                    <option>Government agency</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Message</label>
                <textarea
                  placeholder="Tell us how many placements you run each term."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <div>
                <button className="btn btn-blue" type="submit">
                  Send message
                </button>
              </div>
            </form>
          </div>

          <aside>
            <div className="sbox" style={{ marginBottom: "12px" }}>
              <div className="sh">
                <span className="lbl">Offices</span>
              </div>
              <div className="sb" style={{ display: "grid", gap: "14px" }}>
                <div>
                  <b style={{ fontSize: "12.5px" }}>Kampala</b>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "var(--muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    Plot 9, Nkrumah Road<br />
                    +256 414 000 000
                  </div>
                </div>
                <div>
                  <b style={{ fontSize: "12.5px" }}>Nairobi</b>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "var(--muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    Riverside Drive<br />
                    +254 20 000 0000
                  </div>
                </div>
                <div>
                  <b style={{ fontSize: "12.5px" }}>Berlin</b>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "var(--muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    Torstraße 14<br />
                    +49 30 0000 0000
                  </div>
                </div>
              </div>
            </div>

            <div className="ticket" style={{ padding: "14px" }}>
              <span className="lbl">Office hours</span>
              <div style={{ fontSize: "12.5px", marginTop: "6px" }}>
                Monday to Friday<br />
                08:30 – 17:00 EAT
              </div>
              <div
                style={{
                  borderTop: "1px dashed var(--rule-2)",
                  margin: "12px 0",
                }}
              ></div>
              <span className="lbl">Response time</span>
              <div style={{ fontSize: "12.5px", marginTop: "6px" }}>
                One working day
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
