"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { PLANS } from "../../data";
import { Icon } from "../icons/Icons";

export function PlansView() {
  const { planSeg, setPlanSeg, planAction, go } = useApp();
  const segs = Object.keys(PLANS);
  const data = PLANS[planSeg] || PLANS.companies;

  return (
    <>
      <div className="phead">
        <div className="wrap">
          <div className="crumb">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                go("home");
              }}
              className="lbl"
            >
              Home
            </a>
            <span className="lbl">/</span>
            <span className="lbl ink">Plans</span>
          </div>
          <h1>
            Free where it should be.<br />
            Paid where it costs us.
          </h1>
          <p>
            Students never pay. Companies, agencies, universities and publishers pay for the parts that consume staff time — verification, review, search and reporting.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: "26px" }}>
        <div className="seg">
          {segs.map((k, i) => (
            <button
              key={k}
              type="button"
              className={k === planSeg ? "on" : ""}
              onClick={() => setPlanSeg(k)}
            >
              <span className="n">0{i + 1}</span>
              {PLANS[k].label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "13px", color: "var(--ink-2)", marginBottom: "20px" }}>
          {data.intro}
        </p>

        <div className="tiers">
          {data.tiers.map((t) => (
            <div
              key={t.name}
              className={`tier ${t.kind === "dark" ? "dark" : ""}`}
            >
              {t.ribbon && <span className="ribbon">{t.ribbon}</span>}
              <div className="th">
                <span className={`lbl ${t.kind === "dark" ? "" : "ink"}`}>
                  {t.name}
                </span>
                {t.price === "$0" && <span className="tg">Free</span>}
              </div>
              <div className="price">
                {t.price} <small>{t.per}</small>
              </div>
              <p className="desc">{t.desc}</p>
              <ul>
                {t.features.map(([f, on], idx) => (
                  <li key={idx} className={on ? "" : "off"}>
                    <Icon name={on ? "check" : "x"} size={11} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="tier-cta">
                <button
                  type="button"
                  className={`btn btn-block ${t.kind === "dark" ? "btn-green" : ""}`}
                  onClick={() => planAction(t.name)}
                >
                  {t.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "22px" }}>
          <div
            className="pt-row head"
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
              border: "1px solid var(--rule)",
            }}
          >
            <div>What changes</div>
            <div>{data.tiers[0].name}</div>
            <div>{data.tiers[1].name}</div>
            <div>{data.tiers[2].name}</div>
          </div>
          <div className="plan-table">
            {data.table.map(([k, a, b, c], idx) => (
              <div key={idx} className="pt-row">
                <div>
                  <b style={{ fontWeight: 600 }}>{k}</b>
                </div>
                <div className={a === "—" ? "no" : "yes"}>{a}</div>
                <div className={b === "—" ? "no" : "yes"}>{b}</div>
                <div className={c === "—" ? "no" : "yes"}>{c}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="offers">
          <div className="offer">
            <span className="big">$0</span>
            <b>Students never pay</b>
            <p>
              Browsing, applications, the pack, documents and the tracker are free forever. No card, no trial clock.
            </p>
          </div>
          <div className="offer">
            <span className="big">3</span>
            <b>First three placements free</b>
            <p>
              Companies and agencies can publish three placements and review every applicant before an invoice exists.
            </p>
          </div>
          <div className="offer">
            <span className="big">1 term</span>
            <b>Public universities start free</b>
            <p>
              A full campus plan for one term — all faculties, unlimited students, no card.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            margin: "26px 0 60px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="btn btn-blue"
            onClick={() => go("signin")}
          >
            Create an account
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => go("contact")}
          >
            Ask about procurement
          </button>
        </div>
      </div>
    </>
  );
}
