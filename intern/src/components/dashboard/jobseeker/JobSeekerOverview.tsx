"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  ApiError,
  fetchJobApplications,
  isApiEnabled,
} from "../../../lib/api";
import { ApplicationDto } from "../../../types";

export function JobSeekerOverview() {
  const { session, dashGo } = useApp();
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isApiEnabled || session?.role !== "jobseeker") {
      setLoading(false);
      return;
    }
    fetchJobApplications()
      .then((apps) => {
        setApplications(apps);
        setLoading(false);
      })
      .catch((cause) => {
        setError(cause instanceof ApiError ? cause.message : "Unable to load applications");
        setLoading(false);
      });
  }, [session]);

  const firstName = (session?.name || "").trim().split(/\s+/)[0];
  const openApps = applications.filter((a) => !["Accepted", "Rejected", "Withdrawn"].includes(a.status)).length;

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>{firstName ? `Good morning, ${firstName}` : "Good morning"}</h2>
          <p>
            {applications.length} application{applications.length === 1 ? "" : "s"} ·{" "}
            {openApps} open
          </p>
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
          <b>{applications.length}</b>
          <span className="lbl">applications</span>
        </div>
        <div className="kpi">
          <b>{openApps}</b>
          <span className="lbl">application open</span>
        </div>
        <div className="kpi">
          <b>{applications.filter((a) => a.status === "Accepted").length}</b>
          <span className="lbl">interviews</span>
        </div>
        <div className="kpi">
          <b>{session ? "82%" : "—"}</b>
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
              {loading ? (
                <tr>
                  <td colSpan={4}>Loading applications...</td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={4}>No applications yet. Browse roles to get started.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td className="who">
                      <b>{app.placement_id}</b>
                      <span>Full time</span>
                    </td>
                    <td>Employer</td>
                    <td className="num">{app.created_at}</td>
                    <td>
                      <span className="tg gold">{app.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
