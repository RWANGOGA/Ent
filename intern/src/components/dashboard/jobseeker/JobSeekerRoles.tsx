"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import { ApiError, fetchJobs, isApiEnabled } from "../../../lib/api";
import { Job } from "../../../types";

export function JobSeekerRoles() {
  const { session } = useApp();
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [state, setState] = React.useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!isApiEnabled || session?.role !== "jobseeker") {
      setState("ready");
      return;
    }
    fetchJobs()
      .then((items) => {
        setJobs(items);
        setState("ready");
      })
      .catch((cause) => {
        setError(cause instanceof ApiError ? cause.message : "Unable to load jobs");
        setState("error");
      });
  }, [session]);

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
              {state === "loading" ? (
                <tr><td colSpan={6}>Loading jobs...</td></tr>
              ) : state === "error" ? (
                <tr><td colSpan={6} className="error">{error}</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan={6}>No open jobs are available.</td></tr>
              ) : jobs.map((r) => (
                <tr key={r.id}>
                  <td className="who">
                    <b>{r.title}</b>
                    <span>{r.employmentType}</span>
                  </td>
                  <td>{r.orgName}</td>
                  <td className="hide-xs">{r.loc}</td>
                  <td className="num">{r.salary}</td>
                  <td className="num">{r.closesAt}</td>
                  <td className="act">
                    <span className="tg green">Open</span>
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
