"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import {
  ApiError,
  createOrganizationInternship,
  fetchOrganizationInternships,
  isApiEnabled,
} from "../../../lib/api";
import { Placement } from "../../../types";

export function EmployerPlacements() {
  const { subscription, isPremium, freeAllowance, employerLiveCount, session } =
    useApp();
  const [employerPlacements, setEmployerPlacements] = React.useState<Placement[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [form, setForm] = React.useState({
    title: "",
    courses: "",
    grade: "",
    loc: "",
    mode: "On-site",
    duration: "",
    stipend: "",
    slots: "1",
    about: "",
    requirements: "",
    closesAt: "",
    startsAt: "",
  });
  const remaining = Math.max(0, freeAllowance - employerLiveCount);

  React.useEffect(() => {
    if (!isApiEnabled || session?.role !== "employer") {
      setLoading(false);
      return;
    }
    fetchOrganizationInternships()
      .then(setEmployerPlacements)
      .catch((cause) => {
        setError(cause instanceof ApiError ? cause.message : "Unable to load internships");
      })
      .finally(() => setLoading(false));
  }, [session]);

  async function submitPosting(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const created = await createOrganizationInternship({
        title: form.title,
        courses: form.courses.split(",").map((value) => value.trim()).filter(Boolean),
        grade: form.grade,
        loc: form.loc,
        mode: form.mode,
        duration: form.duration,
        stipend: form.stipend,
        slots: Number(form.slots) || 1,
        about: form.about,
        duties: [],
        requirements: form.requirements.split("\n").map((value) => value.trim()).filter(Boolean),
        docs: [],
        testimonial: false,
        published_at: new Date().toISOString().slice(0, 10),
        closes_at: form.closesAt,
        starts_at: form.startsAt,
      });
      setEmployerPlacements((current) => [created, ...current]);
      setShowForm(false);
      setForm({
        title: "", courses: "", grade: "", loc: "", mode: "On-site",
        duration: "", stipend: "", slots: "1", about: "", requirements: "",
        closesAt: "", startsAt: "",
      });
    } catch (cause) {
      setFormError(cause instanceof ApiError ? cause.message : "Unable to submit internship");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>My placements</h2>
          <p>
            {employerLiveCount} published ·{" "}
            {isPremium ? (
              <>
                <b>{subscription.plan}</b> plan · unlimited postings
                {subscription.since ? ` since ${subscription.since}` : ""}
              </>
            ) : (
              <>
                {remaining} free posting{remaining === 1 ? "" : "s"} left, then a
                placement fee
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-blue"
          onClick={() => setShowForm((current) => !current)}
        >
          {showForm ? "Close form" : "New internship"}
        </button>
      </div>
      {showForm && (
        <form className="panel" onSubmit={submitPosting} style={{ marginBottom: "14px" }}>
          <div className="ph"><span className="lbl">Submit internship for review</span></div>
          <div className="pb" style={{ display: "grid", gap: "10px" }}>
            <div className="dsplit">
              <label>Title<input className="field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
              <label>Eligible courses<input className="field" required placeholder="Computer Science, Design" value={form.courses} onChange={(e) => setForm({ ...form, courses: e.target.value })} /></label>
            </div>
            <div className="dsplit">
              <label>Closing date<input className="field" type="date" required value={form.closesAt} onChange={(e) => setForm({ ...form, closesAt: e.target.value })} /></label>
              <label>Start date<input className="field" type="date" required value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} /></label>
            </div>
            <div className="dsplit">
              <label>Location<input className="field" required value={form.loc} onChange={(e) => setForm({ ...form, loc: e.target.value })} /></label>
              <label>Minimum grade<input className="field" placeholder="CGPA 3.0+" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} /></label>
            </div>
            <label>Requirements<textarea className="field" rows={3} placeholder="One requirement per line" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
            {formError && <p className="error">{formError}</p>}
            <button type="submit" className="btn btn-sm btn-blue" disabled={saving}>{saving ? "Submitting..." : "Submit for admin review"}</button>
          </div>
        </form>
      )}
      <div className="panel">
        <div className="pb" style={{ padding: 0 }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Placement</th>
                <th>Type</th>
                <th className="hide-xs">Courses</th>
                <th>Grade</th>
                <th>Applicants</th>
                <th>Closes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}>Loading internships...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="error">{error}</td></tr>
              ) : employerPlacements.length === 0 ? (
                <tr><td colSpan={7}>No internships submitted yet.</td></tr>
              ) : employerPlacements.map((p) => (
                <tr key={p.id}>
                  <td className="who">
                    <b>{p.title}</b>
                    <span>{p.slots} slots</span>
                  </td>
                  <td>
                    <span className={`tg ${p.reviewStatus === "approved" ? "green" : "gold"}`}>
                      {p.reviewStatus === "pending_review" ? "Pending review" : p.reviewStatus}
                    </span>
                  </td>
                  <td className="hide-xs" style={{ fontSize: "11px" }}>
                    {p.courses.join(", ")}
                  </td>
                  <td className="num">{p.grade}</td>
                  <td className="num">{p.applicants}</td>
                  <td className="num">{p.closesAt || p.deadline}</td>
                  <td className="act"><span className="lbl">{p.startsAt ? `Starts ${p.startsAt}` : ""}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
