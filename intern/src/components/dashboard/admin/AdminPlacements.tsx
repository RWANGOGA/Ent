"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import { Icon } from "../../icons/Icons";

export function AdminPlacements() {
  const { placements, getOrg, newPlacement, editRequirements } = useApp();

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Placements</h2>
          <p>
            {placements.length} listed · companies, government, NGOs and
            university departments
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-blue"
          onClick={newPlacement}
        >
          <Icon name="plus" size={12} /> New placement
        </button>
      </div>
      <div className="panel">
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Placement</th>
                <th>Organisation</th>
                <th>Type</th>
                <th className="hide-xs">Courses</th>
                <th>Grade</th>
                <th className="hide-xs">Docs</th>
                <th>Closes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {placements.slice(0, 9).map((p) => {
                const o = getOrg(p.orgId);
                return (
                  <tr key={p.id}>
                    <td className="who">
                      <b>{p.title}</b>
                      <span>
                        {p.slots} slots · {p.duration}
                      </span>
                    </td>
                    <td>{o?.name}</td>
                    <td>
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
                    <td
                      className="hide-xs"
                      style={{ fontSize: "11px", color: "var(--ink-2)" }}
                    >
                      {p.courses.length} courses
                    </td>
                    <td className="num">{p.grade}</td>
                    <td className="hide-xs">
                      <span className="num">{p.docs.length} required</span>
                    </td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
