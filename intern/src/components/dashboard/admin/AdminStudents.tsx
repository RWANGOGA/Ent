"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";

export function AdminStudents() {
  const { adminQueue, reviewStudent, toast } = useApp();

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Students</h2>
          <p>186 records · 23 documents awaiting verification</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => toast("CSV exported")}
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="panel">
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th className="hide-xs">Placement</th>
                <th>Documents</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {adminQueue.map((s) => (
                <tr key={s.n}>
                  <td className="who">
                    <b>{s.n}</b>
                    <span>
                      {s.y} · {s.i}
                    </span>
                  </td>
                  <td>{s.c}</td>
                  <td className="hide-xs">{s.p}</td>
                  <td className="num">{s.d} verified</td>
                  <td>
                    <span
                      className={`tg ${
                        s.st === "Ready"
                          ? "green"
                          : s.st === "Review"
                          ? "gold"
                          : "red"
                      }`}
                    >
                      {s.st}
                    </span>
                  </td>
                  <td className="act">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => reviewStudent(s.n)}
                    >
                      Open record
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
