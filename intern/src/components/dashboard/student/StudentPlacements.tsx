"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import { matchPlacement } from "../../../lib/skills";

function scoreTone(score: number): { color: string; label: string } {
  if (score >= 70) return { color: "var(--green)", label: "Strong" };
  if (score >= 40) return { color: "var(--gold)", label: "Possible" };
  return { color: "var(--muted)", label: "Low" };
}

export function StudentPlacements() {
  const { placements, getOrg, student, applyTo, openPlacement } = useApp();

  const ranked = placements
    .map((p) => ({
      p,
      match: matchPlacement(p, student.skills, student.course, student.cgpa),
    }))
    .sort((a, b) => b.match.score - a.match.score);

  const strongCount = ranked.filter((r) => r.match.score >= 70).length;

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Placements ranked for you</h2>
          <p>
            Scored against your skills, course and grade — {strongCount} of{" "}
            {placements.length} are a strong match
          </p>
        </div>
      </div>
      <div className="panel">
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Placement</th>
                <th>Organisation</th>
                <th className="hide-xs">Type</th>
                <th>Match</th>
                <th className="hide-xs">Skills you bring</th>
                <th>Closes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ranked.map(({ p, match }) => {
                const o = getOrg(p.orgId);
                const tone = scoreTone(match.score);
                const eligible = match.courseFit && match.gradeFit;
                return (
                  <tr key={p.id}>
                    <td className="who">
                      <b>{p.title}</b>
                      <span>
                        {p.duration} · {p.stipend}
                      </span>
                    </td>
                    <td>{o?.name}</td>
                    <td className="hide-xs">
                      <span
                        className={`tg ${
                          o?.type === "Government"
                            ? "blue"
                            : o?.type === "NGO"
                            ? "green"
                            : o?.type === "University"
                            ? "gold"
                            : ""
                        }`}
                      >
                        {o?.type}
                      </span>
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <div
                        className="bar-track"
                        title={`${tone.label} match — missing: ${
                          match.missing.length ? match.missing.join(", ") : "none"
                        }`}
                      >
                        <div
                          className="bar-fill"
                          style={{ width: `${match.score}%`, background: tone.color }}
                        />
                      </div>
                      <span className="num" style={{ fontSize: 12 }}>
                        {match.score}% · {tone.label}
                      </span>
                    </td>
                    <td className="hide-xs">
                      <span style={{ fontSize: 12 }}>
                        {match.matched.length
                          ? match.matched.join(", ")
                          : "No overlapping skills yet"}
                      </span>
                    </td>
                    <td className="num">{p.deadline}</td>
                    <td className="act">
                      {eligible ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-blue"
                          onClick={() => applyTo(p.id)}
                        >
                          Apply
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => openPlacement(p.id)}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
