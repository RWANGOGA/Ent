"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";

export function StudentPlacements() {
  const { placements, getOrg, isEligible, applyTo, openPlacement } = useApp();
  const eligibleCount = placements.filter(isEligible).length;

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Placements open to you</h2>
          <p>
            Filtered by your course and grade — {eligibleCount} of{" "}
            {placements.length} match
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
                <th>Grade</th>
                <th>Closes</th>
                <th>Eligibility</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {placements.map((p) => {
                const o = getOrg(p.orgId);
                const ok = isEligible(p);
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
                    <td className="num">{p.grade}</td>
                    <td className="num">{p.deadline}</td>
                    <td>
                      <span className={`tg ${ok ? "green" : "red"}`}>
                        {ok ? "Eligible" : "Not eligible"}
                      </span>
                    </td>
                    <td className="act">
                      {ok ? (
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
