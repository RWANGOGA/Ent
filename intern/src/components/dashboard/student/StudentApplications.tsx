"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";

export function StudentApplications() {
  const { applications, getPlacement, getOrg, withdrawApplication, toast } = useApp();

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>My applications</h2>
          <p>Track every internship application from one live record.</p>
        </div>
      </div>
      <div className="panel">
        <div className="ph">
          <span className="lbl">Application history</span>
          <span className="lbl">{applications.length} submitted</span>
        </div>
        <div className="pb" style={{ display: "grid", gap: "10px" }}>
          {!applications.length && (
            <p className="muted">You have not submitted an internship application yet.</p>
          )}
          {applications.map((application) => {
            const placement = getPlacement(application.placement_id);
            const org = placement ? getOrg(placement.orgId) : undefined;
            const canWithdraw = ["Submitted", "In Review"].includes(application.status);
            return (
              <div key={application.id} className="dashboard-recommendation">
                <span>
                  <b>{placement?.title || "Internship application"}</b>
                  <small>
                    {org?.name || "Organisation"} · submitted {application.created_at}
                  </small>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <strong className="tg gold">{application.status}</strong>
                  {canWithdraw && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={async () => {
                        try {
                          await withdrawApplication(application.id);
                        } catch {
                          toast("We could not withdraw this application.");
                        }
                      }}
                    >
                      Withdraw
                    </button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
