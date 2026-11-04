"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";

export function JobSeekerOverview() {
  const { dashGo } = useApp();

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Brian, your graduate search</h2>
          <p>4 roles match your record · 1 application in progress</p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-blue"
          onClick={() => dashGo("roles")}
        >
          Browse roles
        </button>
      </div>
      <div className="kpis">
        <div className="kpi">
          <b>4</b>
          <span className="lbl">matching roles</span>
        </div>
        <div className="kpi">
          <b>1</b>
          <span className="lbl">application open</span>
        </div>
        <div className="kpi">
          <b>0</b>
          <span className="lbl">interviews</span>
        </div>
        <div className="kpi">
          <b>82%</b>
          <span className="lbl">record complete</span>
        </div>
      </div>
      <div className="panel">
        <div className="ph">
          <span className="lbl">Your applications</span>
        </div>
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Role</th>
                <th>Organisation</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="who">
                  <b>Junior Product Designer</b>
                  <span>Full time</span>
                </td>
                <td>Lumen Labs</td>
                <td className="num">3 days ago</td>
                <td>
                  <span className="tg gold">Screening</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
