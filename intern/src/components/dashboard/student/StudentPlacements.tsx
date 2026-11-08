"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "../../../context/AppContext";
import { fetchRecommendedInternships, isApiEnabled, MatchResponse } from "../../../lib/api";
import { Placement } from "../../../types";

function scoreTone(score: number): { color: string; label: string } {
  if (score >= 70) return { color: "var(--green)", label: "Strong" };
  if (score >= 40) return { color: "var(--gold)", label: "Possible" };
  return { color: "var(--muted)", label: "Low" };
}

export function StudentPlacements() {
  const { student, applyTo, openPlacement, go, toast } = useApp();
  const [ranked, setRanked] = useState<MatchResponse["items"]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isApiEnabled || !student.skills.length) {
      // Fallback to client-side matching if API not available or no skills
      setStatus("ready");
      return;
    }
    loadRecommendations();
  }, [student.skills, student.course, student.cgpa]);

  async function loadRecommendations() {
    setStatus("loading");
    try {
      const matches: MatchResponse = await fetchRecommendedInternships(
        student.skills,
        student.course,
        student.cgpa,
        50 // limit
      );
      setRanked(matches.items);
      setStatus("ready");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load recommendations"
      );
      setStatus("error");
    }
  }

  const strongCount = ranked.filter((r) => r.match.score >= 70).length;
  const totalCount = ranked.length;

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Placements ranked for you</h2>
          <p>
            Scored against your skills, course and grade — {strongCount} of {totalCount} are a strong match
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
              {status === "loading" ? (
                <tr><td colSpan={7}>Loading recommendations...</td></tr>
              ) : status === "error" ? (
                <tr><td colSpan={7} className="error">{error}</td></tr>
              ) : ranked.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <p className="muted">
                      {student.skills.length === 0
                        ? "Add skills to your profile to see personalised recommendations."
                        : "No matching placements found. Try updating your skills or course."}
                    </p>
                  </td>
                </tr>
              ) : (
                ranked.map(({ placement: p, match }) => {
                  const o = p.org;
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
