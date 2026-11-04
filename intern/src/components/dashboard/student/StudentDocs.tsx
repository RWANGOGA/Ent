"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import { Icon } from "../../icons/Icons";

export function StudentDocs() {
  const { docs, uploadDoc } = useApp();
  const uploadedCount = docs.filter((d) => d.status !== "missing").length;

  return (
    <>
      <div className="dpane-h">
        <div>
          <h2>Documents</h2>
          <p>Transcripts, IDs, recommendation letters and testimonials</p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-blue"
          onClick={() => uploadDoc("Recommendation letter")}
        >
          <Icon name="upload" size={12} /> Upload
        </button>
      </div>

      <div className="dsplit">
        <div className="panel">
          <div className="ph">
            <span className="lbl">My files</span>
            <span className="lbl">{uploadedCount} uploaded</span>
          </div>
          <div className="pb">
            <div className="files">
              {docs.map((d) => (
                <div key={d.name} className="file">
                  <span className="fi">{d.name.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <b>{d.name}</b>
                    <span>
                      {d.file || "—"} {d.size ? `· ${d.size}` : ""}
                    </span>
                  </div>
                  <span
                    className={`tg ${
                      d.status === "verified"
                        ? "green"
                        : d.status === "pending"
                        ? "gold"
                        : "red"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="ph">
            <span className="lbl">Upload</span>
          </div>
          <div className="pb">
            <div
              className="upload"
              onClick={() => uploadDoc("Recommendation letter")}
            >
              <div className="ic">
                <Icon name="upload" size={24} />
              </div>
              <b>Drop a file or click to upload</b>
              <span>PDF or JPG · up to 10 MB</span>
            </div>
            <div
              style={{
                marginTop: "12px",
                fontSize: "11.5px",
                color: "var(--muted)",
                lineHeight: 1.6,
              }}
            >
              Files are checked by the placement office within 48 hours. A rejected file keeps its reason, so you can replace it without starting again.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
