"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import { Icon } from "../../icons/Icons";

export function StudentDocs() {
  const { docs, resume, uploadResumeFile, uploadDocumentFile } = useApp();
  const [uploadingType, setUploadingType] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const documentTypes = [
    ["transcript", "Transcript"],
    ["student_id", "Student ID"],
    ["national_id", "National ID"],
    ["recommendation", "Recommendation letter"],
    ["portfolio", "Portfolio"],
    ["testimonial", "Testimonial"],
  ];
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
          onClick={() => {
            setUploadingType("transcript");
            inputRef.current?.click();
          }}
        >
          <Icon name="upload" size={12} /> Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) {
              if (uploadingType === "resume") await uploadResumeFile(file);
              else if (uploadingType) await uploadDocumentFile(uploadingType, file);
            }
            event.target.value = "";
            setUploadingType(null);
          }}
        />
      </div>

      <div className="dsplit">
        <div className="panel">
          <div className="ph">
            <span className="lbl">My files</span>
            <span className="lbl">{uploadedCount + (resume ? 1 : 0)} uploaded</span>
          </div>
          <div className="pb">
            <div className="files">
              {resume && (
                <div className="file">
                  <span className="fi">CV</span>
                  <div>
                    <b>Resume</b>
                    <span>{resume.filename} · {(resume.size_bytes / 1024).toFixed(0)} KB</span>
                  </div>
                  <span className="tg green">uploaded</span>
                </div>
              )}
              {documentTypes.map(([type, label]) => {
                const d = docs.find((doc) => doc.name === type);
                return (
                <div key={type} className="file">
                  <span className="fi">{label.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <b>{label}</b>
                    <span>{d ? `${d.file} · ${d.size}` : "Not uploaded"}</span>
                  </div>
                  <span
                    className={`tg ${
                      d?.status === "verified"
                        ? "green"
                        : d?.status === "pending"
                        ? "gold"
                        : "red"
                    }`}
                  >
                    {d?.status || "missing"}
                  </span>
                  <button type="button" className="btn btn-sm" onClick={() => {
                    setUploadingType(type);
                    inputRef.current?.click();
                  }}>
                    {d ? "Replace" : "Upload"}
                  </button>
                </div>
                );
              })}
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
              onClick={() => {
                setUploadingType("resume");
                inputRef.current?.click();
              }}
            >
              <div className="ic">
                <Icon name="upload" size={24} />
              </div>
              <b>Drop a file or click to upload</b>
              <span>PDF or Word · up to 10 MB</span>
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
