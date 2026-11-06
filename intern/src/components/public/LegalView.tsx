"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

type Section = {
  n: string;
  title: string;
  body: React.ReactNode;
};

/**
 * Shared shell for the legal pages, styled with the same primitives as the
 * About page (.phead breadcrumb + .principles sections) so the two documents
 * sit inside the design language instead of inventing a new one.
 */
function LegalShell({
  crumb,
  title,
  intro,
  sections,
}: {
  crumb: string;
  title: React.ReactNode;
  intro: string;
  sections: Section[];
}) {
  const { go } = useApp();
  const [year] = useState(() => new Date().getFullYear());

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
            <span className="lbl ink">{crumb}</span>
          </div>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </div>

      <section className="sec" style={{ paddingTop: "34px" }}>
        <div className="wrap">
          <div className="principles">
            {sections.map((s) => (
              <div className="principle" key={s.n}>
                <span className="n">{s.n}</span>
                <h3>{s.title}</h3>
                <div style={{ display: "grid", gap: "10px" }}>{s.body}</div>
              </div>
            ))}
          </div>

          <p
            style={{
              fontSize: "11.5px",
              color: "var(--muted)",
              marginTop: "22px",
              fontFamily: "var(--mono)",
              letterSpacing: ".04em",
            }}
          >
            Last reviewed {year}. Questions about this page go through the
            Contact form.
          </p>
        </div>
      </section>
    </>
  );
}

export function PrivacyView() {
  return (
    <LegalShell
      crumb="Privacy"
      title={
        <>
          What we hold about<br />a student, and who sees it.
        </>
      }
      intro="BrighterWorks sits between a student, a university office and a host organisation, so it holds academic records. This page says exactly what is collected, who is allowed to read it and under which law."
      sections={[
        {
          n: "01",
          title: "What the record holds",
          body: (
            <>
              <p>
                A <b>placement</b> carries its stated requirements — eligible
                courses, minimum grade, required documents, testimonial rule —
                plus closing date, slots and applicant count.
              </p>
              <p>
                A <b>student record</b> carries name, course, CGPA, the status
                of each document and the application pack: a 600-character
                statement and the target roles the student selects.
              </p>
            </>
          ),
        },
        {
          n: "02",
          title: "Documents, and why each is asked for",
          body: (
            <>
              <p>
                Transcript, national or student ID, recommendation letter,
                portfolio, CV, writing sample and testimonial. A document is
                only requested when a placement names it as a requirement —
                there is no general upload of everything a student possesses.
              </p>
              <p>
                Purpose limitation is the design: the requirement is published
                before anyone applies, so the student knows why each file is
                being collected before uploading it.
              </p>
            </>
          ),
        },
        {
          n: "03",
          title: "Who can see what",
          body: (
            <>
              <p>
                <b>The student</b> sees their own record and every pack sent.
              </p>
              <p>
                <b>The university office</b> sees the documents and makes the
                verification decision, with the reason recorded against the
                file.
              </p>
              <p>
                <b>The host organisation</b> receives only candidates the
                office has cleared, together with their pack. An employer never
                sees an unverified file, and no record is sold, brokered or
                used to train a third-party model.
              </p>
            </>
          ),
        },
        {
          n: "04",
          title: "Law that applies, by region",
          body: (
            <>
              <p>
                Placements in the Netherlands, Germany and the United Kingdom
                are processed under <b>GDPR and UK GDPR</b>. East African
                placements are processed under the <b>Uganda Data Protection
                Act 2019</b>, the <b>Kenya Data Protection Act 2019</b> and the{" "}
                <b>Tanzania Personal Data Protection Act 2022</b>.
              </p>
              <p>
                Bases we rely on: consent when a student uploads a document,
                performance of a contract for the steps of an application, and
                legal obligation for ministry and agency listings. Campus and
                Consortium plans carry data residency in the named territory.
              </p>
            </>
          ),
        },
        {
          n: "05",
          title: "How long we keep it",
          body: (
            <p>
              Documents are held while the student record is active and for the
              placement term it supports. Verification decisions are retained
              longer as an audit trail, because a placement rate reported to a
              ministry has to be traceable to a decision. A student can ask for
              erasure; the office removes the record and any pending
              application with it.
            </p>
          ),
        },
        {
          n: "06",
          title: "Your rights",
          body: (
            <>
              <p>
                Access, rectification, erasure, restriction, objection,
                portability, and withdrawal of consent at any time without
                affecting processing already done. For public-sector listings
                you also have the right to lodge a complaint with your national
                supervisory authority.
              </p>
              <p>
                Requests go through the Contact page. The office replies within
                one working day, Monday to Friday, 08:30–17:00 EAT.
              </p>
            </>
          ),
        },
        {
          n: "07",
          title: "This build is a prototype — read this before testing",
          body: (
            <>
              <p>
                Uploads and applications here are <b>simulated</b>. Nothing is
                transmitted to a server and nothing survives a page reload, so
                do not upload a real transcript or ID while testing.
              </p>
              <p>
                There is no analytics, no advertising and no third-party
                tracker in this build. The one external request the site makes
                is the stylesheet for Instrument Serif, Inter Tight and
                JetBrains Mono from{" "}
                <code>fonts.googleapis.com</code>, which sends your IP address
                to Google. Self-hosting those fonts removes the request, and
                self-hosting is what production deployment should do.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

export function AccessibilityView() {
  return (
    <LegalShell
      crumb="Accessibility"
      title={
        <>
          A placement office<br />has to be usable by everyone.
        </>
      }
      intro="Students with disabilities, and the ministries that publish placements, both need this system to work with assistive technology. We target WCAG 2.2 level AA across the public site and all four dashboards."
      sections={[
        {
          n: "01",
          title: "What is in place today",
          body: (
            <ul style={{ display: "grid", gap: "8px", paddingLeft: "18px" }}>
              <li>
                Decorative icons are hidden from assistive technology, and
                icon-only controls carry a text label.
              </li>
              <li>
                Header dropdowns open on keyboard focus, not on hover alone.
              </li>
              <li>
                A visible focus ring — 2px, offset from the element — on every
                interactive control.
              </li>
              <li>
                Photography has descriptive alternative text; decorative images
                have none.
              </li>
              <li>
                Placement data is in real tables with header cells, not in
                layout grids.
              </li>
              <li>
                Page structure uses landmarks: banner, main content and
                content information.
              </li>
            </ul>
          ),
        },
        {
          n: "02",
          title: "Motion and reading load",
          body: (
            <p>
              If your system asks for reduced motion, transitions and
              animations are switched off site-wide. Text scales to 200 percent
              without losing content, and no layout depends on colour alone —
              every status also carries a word.
            </p>
          ),
        },
        {
          n: "03",
          title: "Known gaps, stated plainly",
          body: (
            <ul style={{ display: "grid", gap: "8px", paddingLeft: "18px" }}>
              <li>
                Dialogs do not yet announce themselves to screen readers and do
                not close on Escape or return focus to the control that opened
                them.
              </li>
              <li>
                There is no skip-to-content link, so keyboard users tab through
                the header on every page.
              </li>
              <li>
                Small mono labels of nine pixels and section numbers in the
                faintest grey are below the contrast we aim at and are hard to
                read at a distance.
              </li>
              <li>
                Dense tables on narrow screens drop columns rather than
                restacking them, so some information is hidden on a phone.
              </li>
              <li>
                The interface is English only. No switcher exists yet for
                French, Swahili or Luganda.
              </li>
            </ul>
          ),
        },
        {
          n: "04",
          title: "Fixed in this release",
          body: (
            <p>
              Footer body text, column labels and the base bar sat at{" "}
              <b>4.00:1</b> against the footer background — under the 4.5:1 we
              claim for normal-size text. They now meet{" "}
              <b>5.08:1</b>. The Privacy and Accessibility links in the footer
              were inert and now open these pages.
            </p>
          ),
        },
        {
          n: "05",
          title: "Tell us where it fails",
          body: (
            <>
              <p>
                If a screen reader, keyboard path or magnifier makes something
                unusable, that is a defect and we treat it as one. Report it
                through the Contact page and we reply within one working day.
              </p>
              <p>
                Need a placement, requirement or document list in another
                format — large print, plain text, braille or read aloud on
                request — the same form is the route. The office is in Kampala,
                Nairobi and Berlin.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
