"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  ApiError,
  fetchOrganizationInternships,
  fetchOrganizationApplicants,
  isApiEnabled,
} from "../../../lib/api";
import { Placement, ApplicationDto } from "../../../types";

export function EmployerApplicants() {
  const { session, dashGo } = useApp();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [applicants, setApplicants] = useState<Record<string, ApplicationDto[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlacementId, setSelectedPlacementId] = useState<string>("");

  useEffect(() => {
    if (!isApiEnabled || session?.role !== "employer") {
      setLoading(false);
      return;
    }
    loadPlacements();
  }, [session]);

  async function loadPlacements() {
    setLoading(true);
    try {
      const items = await fetchOrganizationInternships();
      setPlacements(items);
      if (items.length > 0) {
        setSelectedPlacementId(items[0].id);
        loadApplicants(items[0].id);
      }
      setLoading(false);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Unable to load placements");
      setLoading(false);
    }
  }

  async function loadApplicants(placementId: string) {
    try {
      const apps = await fetchOrganizationApplicants(placementId);
      setApplicants((prev) => ({ ...prev, [placementId]: apps }));
    } catch (cause) {
      console.error("Failed to load applicants:", cause);
    }
  }

  const totalApplicants = Object.values(applicants).flat().length;
  const shortlisted = Object.values(applicants)
    .flat()
    .filter((a) => a.status === "Accepted").length;

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Applicants</h2>
          <p>
            {totalApplicants} candidate{totalApplicants === 1 ? "" : "s"} ·{" "}
            {shortlisted} shortlisted
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => console.log("Export")}
        >
          Export
        </button>
      </div>

      <div className="panel" style={{ marginBottom: "14px" }}>
        <div className="ph">
          <span className="lbl">Select placement</span>
        </div>
        <div className="pb">
          <select
            value={selectedPlacementId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedPlacementId(id);
              if (id && !applicants[id]) loadApplicants(id);
            }}
            className="field"
            style={{ maxWidth: "400px" }}
          >
            {(placements || []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.applicants} applicants)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel">
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Course</th>
                <th>Grade</th>
                <th className="hide-xs">Documents</th>
                <th>Fit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Loading...</td>
                </tr>
              ) : placements.length === 0 ? (
                <tr>
                  <td colSpan={6}>No placements posted yet.</td>
                </tr>
              ) : applicants[selectedPlacementId]?.length === 0 ? (
                <tr>
                  <td colSpan={6}>No applicants for this placement.</td>
                </tr>
              ) : (
                (applicants[selectedPlacementId] || []).map((app, i) => (
                  <tr key={app.id}>
                    <td className="who">
                      <b>{app.user_id.slice(0, 8)}…</b>
                      <span>Year 3</span>
                    </td>
                    <td>{app.placement_id}</td>
                    <td className="num">3.7</td>
                    <td className="hide-xs">
                      <span className="tg green">3 of 3 verified</span>
                    </td>
                    <td className="num">93%</td>
                    <td className="act">
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => console.log("Invite", app.id)}
                      >
                        Invite
                      </button>
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
