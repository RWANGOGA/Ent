"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import { Icon } from "../../icons/Icons";

export function StudentOverview() {
  const { placements, getOrg, student, dashGo } = useApp();
  const p = placements[1];
  const o = getOrg(p.orgId);

  const checklist: [string, boolean, string][] = [
    ["Course matches", true, "Design is an eligible course"],
    ["Grade threshold", true, "3.7 meets Second Class Upper"],
    ["Transcript", true, "Verified 12 Feb"],
    ["National ID", true, "Verified 12 Feb"],
    ["Recommendation letter", false, "Upload before 28 Feb"],
    ["Supervisor testimonial", false, "Request from your tutor"],
  ];

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Good morning, Amina</h2>
          <p>One application in review · two requirements outstanding</p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-blue"
          onClick={() => dashGo("placements")}
        >
          Find placements
        </button>
      </div>

      <div className="dsplit">
        <div style={{ display: "grid", gap: "14px" }}>
          <div className="ticket" style={{ padding: "18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <div>
                <span className="lbl">Current application</span>
                <h3
                  className="serif"
                  style={{
                    fontSize: "26px",
                    lineHeight: 1.1,
                    marginTop: "6px",
                  }}
                >
                  {p.title}
                </h3>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted)",
                    marginTop: "3px",
                  }}
                >
                  {o?.name} · {p.loc} · closes {p.deadline}
                </div>
              </div>
              <span className="tg gold">Under review</span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 0,
                marginTop: "18px",
                borderTop: "1px dashed var(--rule-2)",
                paddingTop: "14px",
              }}
            >
              {["Submitted", "Documents", "Review", "Decision"].map(
                (s, i) => (
                  <div
                    key={s}
                    style={{
                      flex: 1,
                      borderRight: i < 3 ? "1px solid var(--rule)" : 0,
                      paddingRight: "10px",
                    }}
                  >
                    <div
                      className="lbl"
                      style={{
                        color: i < 2 ? "var(--green)" : "var(--faint)",
                      }}
                    >
                      0{i + 1}
                    </div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        marginTop: "3px",
                        color: i < 2 ? "var(--ink)" : "var(--muted)",
                      }}
                    >
                      {s}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="panel">
            <div className="ph">
              <span className="lbl">Requirements for this placement</span>
              <span className="lbl">4 of 6</span>
            </div>
            <div className="pb">
              <div className="check">
                {checklist.map(([t, ok, note]) => (
                  <div key={t} className={`ci ${ok ? "done" : "todo"}`}>
                    <span className="box">
                      {ok && <Icon name="check" size={9} />}
                    </span>
                    <div className="t">
                      <b>{t}</b>
                      <span>{note}</span>
                    </div>
                    <span className="st">{ok ? "Met" : "Action"}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-blue"
                style={{ marginTop: "12px" }}
                onClick={() => dashGo("documents")}
              >
                Upload missing documents
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <div className="panel">
            <div className="ph">
              <span className="lbl">Deadlines</span>
            </div>
            <div className="pb" style={{ display: "grid", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11.5px",
                }}
              >
                <span>Recommendation letter</span>
                <b style={{ color: "var(--red)" }}>28 Feb</b>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11.5px",
                }}
              >
                <span>Testimonial</span>
                <b style={{ color: "var(--red)" }}>28 Feb</b>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11.5px",
                }}
              >
                <span>Ministry application</span>
                <b>12 Mar</b>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="ph">
              <span className="lbl">My record</span>
            </div>
            <div
              className="pb"
              style={{ display: "grid", gap: "7px", fontSize: "11.5px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Course</span>
                <b>{student.course}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Year</span>
                <b>{student.year}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>CGPA</span>
                <b>{student.cgpa}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>University</span>
                <b>{student.uni}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
