"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import {
  ApiError,
  fetchInternshipReviewQueue,
  isApiEnabled,
  reviewInternship,
} from "../../../lib/api";
import { Placement } from "../../../types";

export function AdminPlacements() {
  const { getOrg, toast, session } = useApp();
  const [queue, setQueue] = React.useState<Placement[]>([]);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [error, setError] = React.useState("");
  const [actionId, setActionId] = React.useState("");
  const [rejecting, setRejecting] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (!isApiEnabled || session?.role !== "admin") {
      setStatus("ready");
      return;
    }
    fetchInternshipReviewQueue()
      .then((items) => {
        setQueue(items);
        setStatus("ready");
      })
      .catch((cause) => {
        setError(
          cause instanceof ApiError
            ? cause.message
            : "Unable to load the internship review queue"
        );
        setStatus("error");
      });
  }, [session]);

  async function decide(
    internshipId: string,
    decision: "approved" | "rejected",
    rejectionReason = ""
  ) {
    setActionId(internshipId);
    try {
      await reviewInternship(internshipId, decision, rejectionReason);
      setQueue((items) => items.filter((item) => item.id !== internshipId));
      setRejecting(null);
      setReason("");
      toast(decision === "approved" ? "Internship approved" : "Internship rejected");
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : "Unable to update internship review"
      );
    } finally {
      setActionId("");
    }
  }

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Internship verification</h2>
          <p>
            {queue.length} internship{queue.length === 1 ? "" : "s"} awaiting
            administrator review
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
                <th>Type</th>
                <th className="hide-xs">Courses</th>
                <th>Grade</th>
                <th className="hide-xs">Docs</th>
                <th>Closes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" ? (
                <tr><td colSpan={8}>Loading review queue...</td></tr>
              ) : status === "error" ? (
                <tr><td colSpan={8} className="error">{error}</td></tr>
              ) : queue.length === 0 ? (
                <tr><td colSpan={8}>No internships are waiting for review.</td></tr>
              ) : queue.map((p) => {
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
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <button type="button" className="btn btn-sm btn-blue" disabled={actionId === p.id} onClick={() => decide(p.id, "approved")}>Approve</button>
                        <button type="button" className="btn btn-sm" disabled={actionId === p.id} onClick={() => setRejecting(p.id)}>Reject</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {rejecting && (
        <div className="panel" style={{ marginTop: "14px" }}>
          <div className="ph"><span className="lbl">Rejection reason</span></div>
          <div className="pb" style={{ display: "grid", gap: "10px" }}>
            <textarea className="field" rows={3} required value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain what the organisation must correct." />
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" className="btn btn-sm btn-blue" disabled={!reason.trim() || actionId === rejecting} onClick={() => decide(rejecting, "rejected", reason)}>Send rejection</button>
              <button type="button" className="btn btn-sm" onClick={() => setRejecting(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
