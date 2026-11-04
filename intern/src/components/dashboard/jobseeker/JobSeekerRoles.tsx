"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import { GRAD_ROLES } from "../../../data";

export function JobSeekerRoles() {
  const { toast } = useApp();

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Graduate roles</h2>
          <p>Beyond internships · verified employers only</p>
        </div>
      </div>
      <div className="panel">
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Role</th>
                <th>Organisation</th>
                <th className="hide-xs">Location</th>
                <th>Pay</th>
                <th>Closes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {GRAD_ROLES.map((r) => (
                <tr key={r.id}>
                  <td className="who">
                    <b>{r.title}</b>
                    <span>{r.type}</span>
                  </td>
                  <td>{r.org}</td>
                  <td className="hide-xs">{r.loc}</td>
                  <td className="num">{r.pay}</td>
                  <td className="num">{r.closes}</td>
                  <td className="act">
                    <button
                      type="button"
                      className="btn btn-sm btn-blue"
                      onClick={() => toast(`Application started · ${r.title}`)}
                    >
                      Apply
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
