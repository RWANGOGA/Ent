"use client";

import React from "react";

export function JobSeekerApps() {
  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Applications</h2>
          <p>1 open · 0 closed</p>
        </div>
      </div>
      <div className="panel">
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
