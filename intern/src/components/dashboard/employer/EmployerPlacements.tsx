"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";

export function EmployerPlacements() {
  const { placements, newPlacement, editRequirements } = useApp();
  const employerPlacements = placements.filter((p) => p.orgId === "o4");

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>My placements</h2>
          <p>2 live · 1 draft</p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-blue"
          onClick={newPlacement}
        >
          New placement
        </button>
      </div>
      <div className="panel">
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Placement</th>
                <th>Type</th>
                <th className="hide-xs">Courses</th>
                <th>Grade</th>
                <th>Applicants</th>
                <th>Closes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employerPlacements.map((p) => (
                <tr key={p.id}>
                  <td className="who">
                    <b>{p.title}</b>
                    <span>{p.slots} slots</span>
                  </td>
                  <td>
                    <span className="tg">Company</span>
                  </td>
                  <td className="hide-xs" style={{ fontSize: "11px" }}>
                    {p.courses.join(", ")}
                  </td>
                  <td className="num">{p.grade}</td>
                  <td className="num">{p.applicants}</td>
                  <td className="num">{p.deadline}</td>
                  <td className="act">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => editRequirements(p.id)}
                    >
                      Requirements
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
