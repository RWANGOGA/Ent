"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";

export function EmployerApplicants() {
  const { adminQueue, go, toast } = useApp();

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Applicants</h2>
          <p>55 candidates · only those meeting your stated requirements</p>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => toast("Shortlist exported")}
        >
          Export
        </button>
      </div>

      <div
        className="panel"
        style={{ marginBottom: "14px", borderColor: "var(--ink)" }}
      >
        <div
          className="pb"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span className="lbl">Premium · talent search</span>
            <div style={{ fontSize: "12.5px", marginTop: "4px" }}>
              Search 41,208 verified students by course, grade, skill and availability — before a placement exists.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-blue"
            onClick={() => go("plans")}
          >
            Unlock search
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Course</th>
                <th>Grade</th>
                <th className="hide-xs">Documents</th>
                <th>Fit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {adminQueue.map((s, i) => (
                <tr key={s.n}>
                  <td className="who">
                    <b>{s.n}</b>
                    <span>{s.y} · Makerere</span>
                  </td>
                  <td>{s.c}</td>
                  <td className="num">{(3.2 + i * 0.12).toFixed(1)}</td>
                  <td className="hide-xs">
                    <span className="tg green">3 of 3 verified</span>
                  </td>
                  <td className="num">{93 - i * 2}%</td>
                  <td className="act">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => toast(`${s.n} invited to interview`)}
                    >
                      Invite
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
