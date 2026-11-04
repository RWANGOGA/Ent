"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import { Icon } from "../../icons/Icons";

export function EmployerOverview() {
  const { adminQueue, newPlacement, dashGo, go, showEmbed, toast } = useApp();

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Lumen Labs</h2>
          <p>2 placements listed · 55 applicants · 6 shortlisted</p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-blue"
          onClick={newPlacement}
        >
          <Icon name="plus" size={12} /> New placement
        </button>
      </div>
      <div className="kpis">
        <div className="kpi">
          <b>2</b>
          <span className="lbl">placements live</span>
        </div>
        <div className="kpi">
          <b>55</b>
          <span className="lbl">applicants</span>
        </div>
        <div className="kpi">
          <b>6</b>
          <span className="lbl">shortlisted</span>
        </div>
        <div className="kpi">
          <b>9 days</b>
          <span className="lbl">median to hire</span>
        </div>
      </div>

      <div className="panel">
        <div className="ph">
          <span className="lbl">Recent applicants</span>
          <button
            type="button"
            className="lbl blue"
            onClick={() => dashGo("applicants")}
          >
            View all
          </button>
        </div>
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Course</th>
                <th className="hide-xs">University</th>
                <th>Documents</th>
                <th>Fit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {adminQueue.slice(0, 4).map((s, i) => (
                <tr key={s.n}>
                  <td className="who">
                    <b>{s.n}</b>
                    <span>{s.y}</span>
                  </td>
                  <td>{s.c}</td>
                  <td className="hide-xs">Makerere</td>
                  <td>
                    <span className="tg green">Verified</span>
                  </td>
                  <td className="num">{93 - i * 2}%</td>
                  <td className="act">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => toast(`${s.n} shortlisted`)}
                    >
                      Shortlist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dsplit" style={{ marginTop: "14px" }}>
        <div className="panel">
          <div className="ph">
            <span className="lbl">Plan and usage</span>
            <span className="tg gold">Premium trial · 11 days left</span>
          </div>
          <div className="pb">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11.5px",
              }}
            >
              <span>Live placements</span>
              <b>2 of 3 free</b>
            </div>
            <div
              className="bar"
              style={{
                height: "5px",
                background: "var(--paper-2)",
                position: "relative",
                margin: "7px 0 12px",
              }}
            >
              <i
                style={{
                  position: "absolute",
                  inset: "0 auto 0 0",
                  width: "66%",
                  background: "var(--blue)",
                }}
              ></i>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11.5px",
              }}
            >
              <span>Review time</span>
              <b className="green">24 hours · priority</b>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11.5px",
                marginTop: "8px",
              }}
            >
              <span>Applications this month</span>
              <b>55</b>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "14px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="btn btn-sm btn-blue"
                onClick={() => go("plans")}
              >
                Compare plans
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => toast("Invoice request sent")}
              >
                Request invoice
              </button>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="ph">
            <span className="lbl">Premium tools</span>
          </div>
          <div className="pb" style={{ display: "grid", gap: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: "1px solid var(--rule)",
                fontSize: "11.5px",
              }}
            >
              <span>Featured placement</span>
              <span className="tg green">On</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: "1px solid var(--rule)",
                fontSize: "11.5px",
              }}
            >
              <span>Talent search</span>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => go("plans")}
              >
                Unlock
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: "1px solid var(--rule)",
                fontSize: "11.5px",
              }}
            >
              <span>ATS and calendar sync</span>
              <span className="tg">Off</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                fontSize: "11.5px",
              }}
            >
              <span>Career page embed</span>
              <button
                type="button"
                className="btn btn-sm"
                onClick={showEmbed}
              >
                Get code
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
