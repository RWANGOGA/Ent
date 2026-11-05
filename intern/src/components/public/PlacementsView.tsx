"use client";

import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { COURSES } from "../../data";
import { Icon } from "../icons/Icons";
import { PlacementCard } from "./PlacementCard";

export function PlacementsView() {
  const {
    placements,
    getOrg,
    typeFilter,
    setTypeFilter,
    sectorFilter,
    setSectorFilter,
    courseFilter,
    setCourseFilter,
    searchQuery,
    setSearchQuery,
    go,
    signIn,
  } = useApp();

  const sectors = useMemo(() => {
    const list = placements.map((p) => getOrg(p.orgId)?.sector).filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(list))];
  }, [placements, getOrg]);

  const filtered = useMemo(() => {
    return placements.filter((p) => {
      const o = getOrg(p.orgId);
      if (!o) return false;
      const t = typeFilter === "All" || o.type === typeFilter;
      const s = sectorFilter === "All" || o.sector === sectorFilter;
      const c = courseFilter === "All" || p.courses.includes(courseFilter);
      const q =
        !searchQuery ||
        (p.title + " " + o.name).toLowerCase().includes(searchQuery.toLowerCase());
      return t && s && c && q;
    });
  }, [placements, getOrg, typeFilter, sectorFilter, courseFilter, searchQuery]);

  const handleReset = () => {
    setTypeFilter("All");
    setSectorFilter("All");
    setCourseFilter("All");
    setSearchQuery("");
  };

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
            <span className="lbl ink">Placements</span>
          </div>
          <h1>Placements</h1>
          <p id="pcount">
            {filtered.length} of 1,284 open placements. Government and NGO listings carry the same requirement fields as companies.
          </p>
        </div>
      </div>

      <div className="wrap">
        <div className="fbar">
          <div className="fld">
            <label className="lbl">Organisation type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All organisations</option>
              <option value="Company">Companies</option>
              <option value="Government">Government agencies</option>
              <option value="NGO">NGOs</option>
              <option value="University">Universities</option>
            </select>
          </div>
          <div className="fld">
            <label className="lbl">Sector</label>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All sectors" : s}
                </option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label className="lbl">Course</label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="All">Any course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="fld" style={{ minWidth: "200px" }}>
            <label className="lbl">Search</label>
            <input
              id="pq"
              placeholder="Role or organisation"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="spacer"></div>
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        <div className="dgrid" style={{ paddingTop: 0 }}>
          <div>
            {filtered.length > 0 ? (
              <div className="jcards" id="plistBody">
                {filtered.map((p) => (
                  <PlacementCard key={p.id} placement={p} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "var(--muted)",
                  border: "1px solid var(--rule)",
                  borderRadius: "var(--r-lg)",
                }}
              >
                No placements match these filters.
              </div>
            )}
          </div>

          <aside className="side">
            <div className="sbox">
              <div className="sh">
                <span className="lbl">How eligibility works</span>
              </div>
              <div className="sb">
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--ink-2)",
                    lineHeight: 1.65,
                  }}
                >
                  A placement is open to you when your course is listed <b>and</b> your grade meets the stated minimum. Both fields are set by the university and the host organisation.
                </p>
                <div className="rule" style={{ margin: "12px 0" }}></div>
                <div className="lbl" style={{ marginBottom: "8px" }}>
                  Your record
                </div>
                <div style={{ fontSize: "12px" }}>Design · Year 3 · CGPA 3.7</div>
                <a
                  href="#signin"
                  className="btn btn-sm btn-block"
                  style={{ marginTop: "12px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    signIn("student");
                  }}
                >
                  Check my eligibility
                </a>
              </div>
            </div>

            <div className="sbox">
              <div className="sh">
                <span className="lbl">Documents usually asked for</span>
              </div>
              <div className="sb">
                <div className="doclist">
                  <span className="doc">
                    <Icon name="doc" size={10} /> Transcript
                  </span>
                  <span className="doc">
                    <Icon name="doc" size={10} /> Student ID
                  </span>
                  <span className="doc">
                    <Icon name="doc" size={10} /> Recommendation
                  </span>
                  <span className="doc">
                    <Icon name="doc" size={10} /> Testimonial
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
