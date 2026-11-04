"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";

export function AdminRequirements() {
  const { placements, getOrg, editRequirements, toast } = useApp();

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Requirements</h2>
          <p>
            Eligible courses, minimum grade, documents and testimonial rule — per
            placement
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => toast("Requirement template applied to 12 placements")}
        >
          Apply a template
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
        }}
        className="reqgrid"
      >
        {placements.slice(0, 4).map((p) => {
          const o = getOrg(p.orgId);
          return (
            <div key={p.id} className="fold" style={{ padding: "18px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <span className="lbl">
                    {o?.type} · {p.deadline}
                  </span>
                  <h3
                    className="serif"
                    style={{
                      fontSize: "21px",
                      marginTop: "5px",
                      lineHeight: 1.1,
                    }}
                  >
                    {p.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      marginTop: "2px",
                    }}
                  >
                    {o?.name}
                  </div>
                </div>
                <span className={`tg ${p.testimonial ? "gold" : ""}`}>
                  {p.testimonial ? "Testimonial" : "No testimonial"}
                </span>
              </div>
              <div style={{ marginTop: "12px" }}>
                <div className="reqrow" style={{ padding: "8px 0" }}>
                  <div className="k">Courses</div>
                  <div className="doclist">
                    {p.courses.map((c) => (
                      <span key={c} className="doc">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="reqrow" style={{ padding: "8px 0" }}>
                  <div className="k">Grade</div>
                  <div>
                    <b>{p.grade}</b>
                  </div>
                </div>
                <div
                  className="reqrow"
                  style={{ padding: "8px 0", borderBottom: 0 }}
                >
                  <div className="k">Documents</div>
                  <div className="doclist">
                    {p.docs.map((d) => (
                      <span key={d} className="doc">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <span className="lbl">{p.applicants} applicants</span>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => editRequirements(p.id)}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
