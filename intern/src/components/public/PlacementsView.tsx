"use client";

import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { COURSES } from "../../data";
import { Icon } from "../icons/Icons";

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
    openPlacement,
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
            <table className="ptable">
              <thead>
                <tr>
                  <th>Placement</th>
                  <th>Organisation</th>
                  <th>Type</th>
                  <th>Courses</th>
                  <th>Closes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="plistBody">
                {filtered.length > 0 ? (
                  filtered.map((p) => {
                    const o = getOrg(p.orgId);
                    return (
                      <tr key={p.id} onClick={() => openPlacement(p.id)}>
                        <td className="r">
                          <b>{p.title}</b>
                          <span>
                            {p.slots} slots · {p.duration}
                          </span>
                        </td>
                        <td>{o?.name}</td>
                        <td className="type">{o?.type}</td>
                        <td style={{ fontSize: "11.5px", color: "var(--ink-2)" }}>
                          {p.courses.slice(0, 2).join(", ")}
                          {p.courses.length > 2 ? " +" : ""}
                        </td>
                        <td className="dead">{p.deadline}</td>
                        <td style={{ textAlign: "right" }} className="arr">
                          <Icon name="arrow" size={13} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "30px",
                        textAlign: "center",
                        color: "var(--muted)",
                      }}
                    >
                      No placements match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
