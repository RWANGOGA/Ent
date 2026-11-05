"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  Org,
  Placement,
  GradRole,
  Student,
  DocItem,
  AdminQueueItem,
  ActivityItem,
  ApplicationPack,
  UserRole,
  DashboardView,
  ChatMessage,
  ModalConfig,
} from "../types";
import {
  ORGS,
  COURSES,
  PLACEMENTS,
  INITIAL_STUDENT,
  GRADE_RANK,
  INITIAL_DOCS,
  INITIAL_ADMIN_QUEUE,
  ACTIVITY,
  INITIAL_PACK,
} from "../data";

interface AppContextType {
  route: string;
  pid: string | null;
  typeFilter: string;
  sectorFilter: string;
  courseFilter: string;
  searchQuery: string;
  planSeg: string;
  role: UserRole;
  dash: DashboardView;

  // Data
  orgs: Org[];
  placements: Placement[];
  student: Student;
  docs: DocItem[];
  adminQueue: AdminQueueItem[];
  activity: ActivityItem[];
  pack: ApplicationPack;

  // UI state
  isMenuOpen: boolean;
  isSideDrawerOpen: boolean;
  toastMessage: string | null;
  modal: ModalConfig | null;
  isChatOpen: boolean;
  chatMessages: ChatMessage[];

  // Setters & Actions
  setTypeFilter: (t: string) => void;
  setSectorFilter: (s: string) => void;
  setCourseFilter: (c: string) => void;
  setSearchQuery: (q: string) => void;
  setPlanSeg: (s: string) => void;
  setStatement: (statement: string) => void;

  // Skills profile
  addSkill: (name: string) => void;
  removeSkill: (name: string) => void;
  toggleSkill: (name: string) => void;
  setSkills: (skills: string[]) => void;

  go: (route: string) => void;
  openPlacement: (id: string) => void;
  setType: (t: string) => void;
  signIn: (role: UserRole) => void;
  dashGo: (view: DashboardView) => void;

  openMenu: () => void;
  closeMenu: () => void;
  openSide: () => void;
  closeSide: () => void;
  toast: (msg: string) => void;
  openModal: (
    title: string,
    body: ReactNode,
    okLabel?: string | null,
    onOk?: (() => void) | null
  ) => void;
  closeModal: () => void;
  modalConfirm: () => void;

  openChat: () => void;
  closeChat: () => void;
  sendChat: (text: string) => void;
  askChat: (text: string) => void;

  // Domain Actions
  applyTo: (id: string) => void;
  reviewStudent: (name: string) => void;
  editRequirements: (id: string) => void;
  newPlacement: () => void;
  uploadDoc: (name: string) => void;
  editPack: () => void;
  previewPack: () => void;
  showEmbed: () => void;
  planAction: (tier: string) => void;

  // Helpers
  getOrg: (id: string) => Org | undefined;
  getPlacement: (id: string) => Placement | undefined;
  isEligible: (p: Placement) => boolean;
  gradeRank: (g: string) => number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<string>("home");
  const [pid, setPid] = useState<string | null>("p1");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [sectorFilter, setSectorFilter] = useState<string>("All");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [planSeg, setPlanSeg] = useState<string>("companies");
  const [role, setRole] = useState<UserRole>("student");
  const [dash, setDash] = useState<DashboardView>("overview");

  const [orgs, setOrgs] = useState<Org[]>(ORGS);
  const [placements, setPlacements] = useState<Placement[]>(PLACEMENTS);
  const [student, setStudent] = useState<Student>(INITIAL_STUDENT);
  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [adminQueue, setAdminQueue] = useState<AdminQueueItem[]>(INITIAL_ADMIN_QUEUE);
  const [activity, setActivity] = useState<ActivityItem[]>(ACTIVITY);
  const [pack, setPack] = useState<ApplicationPack>(INITIAL_PACK);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalConfig | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      who: "INTERN",
      text: "I can check whether you qualify for a placement, list the documents you still need, or explain how verification works. You are signed in as a Design student with a 3.7 CGPA.",
    },
  ]);

  const getOrg = useCallback(
    (id: string) => orgs.find((o) => o.id === id),
    [orgs]
  );

  const getPlacement = useCallback(
    (id: string) => placements.find((p) => p.id === id),
    [placements]
  );

  const gradeRank = useCallback((g: string) => GRADE_RANK[g] || 0, []);

  const isEligible = useCallback(
    (p: Placement) => {
      return (
        p.courses.includes(student.course) &&
        student.cgpa >= (GRADE_RANK[p.grade] || 0)
      );
    },
    [student]
  );

  const toast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  }, []);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = "";
  }, []);

  const openSide = useCallback(() => {
    setIsSideDrawerOpen(true);
  }, []);

  const closeSide = useCallback(() => {
    setIsSideDrawerOpen(false);
  }, []);

  const openModal = useCallback(
    (
      title: string,
      body: ReactNode,
      okLabel: string | null = "Save",
      onOk: (() => void) | null = null
    ) => {
      setModal({ title, body, okLabel, onOk });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const modalConfirm = useCallback(() => {
    if (modal?.onOk) {
      modal.onOk();
    }
    setModal(null);
  }, [modal]);

  const openChat = useCallback(() => {
    setIsChatOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    document.body.style.overflow = "";
  }, []);

  // Sync hash routing
  const navigateByHash = useCallback((hashStr: string) => {
    const raw = hashStr.replace("#", "");
    if (!raw) {
      setRoute("home");
      return;
    }
    if (raw.startsWith("placement-")) {
      const id = raw.split("-")[1];
      setPid(id);
      setRoute("placement");
    } else if (raw.startsWith("dashboard")) {
      const parts = raw.split("-");
      const r = (parts[1] as UserRole) || "student";
      const d = (parts[2] as DashboardView) || "overview";
      setRole(r);
      setDash(d);
      setRoute("dashboard");
    } else if (raw === "ask") {
      setRoute("home");
      setTimeout(() => setIsChatOpen(true), 300);
    } else if (raw === "top") {
      // In-page fragment used by the footer "Back to top" link. It is not a
      // route: without this guard an unknown hash falls through to the
      // public-site switch and silently sends the visitor to Home.
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setRoute(raw);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      navigateByHash(window.location.hash);
    };

    if (typeof window !== "undefined") {
      if (window.location.hash) {
        navigateByHash(window.location.hash);
      }
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, [navigateByHash]);

  const go = useCallback(
    (newRoute: string) => {
      closeMenu();
      setRoute(newRoute);
      if (typeof window !== "undefined") {
        if (newRoute === "dashboard") {
          window.location.hash = `#dashboard-${role}-${dash}`;
        } else if (newRoute === "placement" && pid) {
          window.location.hash = `#placement-${pid}`;
        } else {
          window.location.hash = `#${newRoute}`;
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    },
    [closeMenu, role, dash, pid]
  );

  const openPlacement = useCallback(
    (id: string) => {
      setPid(id);
      setRoute("placement");
      if (typeof window !== "undefined") {
        window.location.hash = `#placement-${id}`;
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    },
    []
  );

  const setType = useCallback(
    (t: string) => {
      setTypeFilter(t);
      setRoute("placements");
      if (typeof window !== "undefined") {
        window.location.hash = "#placements";
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    },
    []
  );

  const signIn = useCallback(
    (newRole: UserRole) => {
      setRole(newRole);
      setDash("overview");
      if (newRole === "student") {
        setStudent((prev) => ({ ...prev, name: "Amina Nakato" }));
      }
      setRoute("dashboard");
      if (typeof window !== "undefined") {
        window.location.hash = `#dashboard-${newRole}-overview`;
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    },
    []
  );

  const dashGo = useCallback(
    (view: DashboardView) => {
      setDash(view);
      setIsSideDrawerOpen(false);
      setRoute("dashboard");
      if (typeof window !== "undefined") {
        window.location.hash = `#dashboard-${role}-${view}`;
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    },
    [role]
  );

  // Chat assistant logic
  const answerChat = useCallback(
    (query: string): string => {
      const q = query.toLowerCase();

      if (
        q.includes("eligible") ||
        q.includes("qualify") ||
        q.includes("can i apply")
      ) {
        const found =
          placements.find((x) =>
            q.includes(x.title.toLowerCase().split(" ")[0].toLowerCase())
          ) ||
          (pid ? getPlacement(pid) : null) ||
          placements[1];

        const targetP = found || placements[1];
        const ok = isEligible(targetP);
        const courseOk = targetP.courses.includes(student.course);
        const targetOrg = getOrg(targetP.orgId);
        const orgName = targetOrg ? targetOrg.name : "the organisation";

        return ok
          ? `Yes — for <b>${targetP.title}</b> at ${orgName}. Your course (${student.course}) is on the list and your CGPA of ${student.cgpa} clears ${targetP.grade}. You still need ${
              targetP.docs.filter((d) => {
                const h = docs.find((x) => x.name === d);
                return !h || h.status === "missing";
              }).length
            } document(s) uploaded before the office can forward your file. Closing date is ${targetP.deadline}.`
          : `Not on paper. <b>${targetP.title}</b> requires ${targetP.grade} and the courses ${targetP.courses.join(", ")}. Your record is ${student.course} at ${student.cgpa}${
              courseOk ? "" : " — your course is not on their list"
            }. The university can still request an exception; that goes to the placement office, not the employer.`;
      }

      if (
        q.includes("document") ||
        q.includes("upload") ||
        q.includes("need")
      ) {
        const missing = docs
          .filter((d) => d.status === "missing")
          .map((d) => d.name);
        return `Three states matter: verified, pending and missing. On your record, ${
          docs.filter((d) => d.status === "verified").length
        } files are verified and ${missing.length} are missing${
          missing.length ? " (" + missing.join(", ") + ")" : ""
        }. Upload from Documents — PDF or JPG up to 10 MB. The office reviews within 48 hours and a rejection keeps its reason, so you can replace the file without starting again.`;
      }

      if (
        q.includes("government") ||
        q.includes("ministry") ||
        q.includes("agency")
      ) {
        const gov = placements.filter(
          (p) => getOrg(p.orgId)?.type === "Government"
        );
        const orgNames = Array.from(
          new Set(gov.map((p) => getOrg(p.orgId)?.name || ""))
        )
          .filter(Boolean)
          .slice(0, 3)
          .join(", ");
        return `There are ${gov.length} government placements live, from ${orgNames}. They use the same requirement fields as companies — courses, minimum grade, documents, testimonial. The Data Analyst Intern closes soonest, on 28 February.`;
      }

      if (
        q.includes("verification") ||
        q.includes("verify") ||
        q.includes("transcript")
      ) {
        return `Your transcript and student ID are verified by the placement office, not by the employer. A placement officer opens the file, checks it against the university record and marks it verified or returns it with a reason. Median turnaround is 48 hours. Employers only ever see verified files.`;
      }

      if (
        q.includes("deadline") ||
        q.includes("closing") ||
        q.includes("close")
      ) {
        const soon = placements
          .slice()
          .sort(
            (a, b) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          )
          .slice(0, 3);
        return `The next three deadlines are ${soon
          .map((p) => `${p.title} (${p.deadline})`)
          .join(", ")}. Atlas Health closes first. I can check your eligibility for any of them before you spend an application.`;
      }

      if (
        q.includes("cost") ||
        q.includes("pay") ||
        q.includes("free") ||
        q.includes("price")
      ) {
        return `Applying is free and always will be. Universities and host organisations fund the service. There is no premium tier for students and no fee to unlock a placement.`;
      }

      if (
        q.includes("contact") ||
        q.includes("office") ||
        q.includes("phone") ||
        q.includes("email")
      ) {
        return `The office is at Plot 9, Nkrumah Road, Kampala — Monday to Friday, 08:30 to 17:00 EAT, with a one working day reply. Nairobi and Berlin offices are listed on the Contact page.`;
      }

      if (
        q.includes("what is intern") ||
        q.includes("about") ||
        q.includes("how does it work")
      ) {
        return `INTERN is a placement system, not a job board. Universities publish placements from companies, government agencies and NGOs; each carries its eligible courses, minimum grade, required documents and testimonial rule. Students see eligibility before applying, the office verifies documents, and employers receive only qualified files.`;
      }

      return `I can check your eligibility against any placement, list the documents you still need, explain verification, or show the next deadlines. Ask about a specific role and I will use its actual requirements.`;
    },
    [placements, pid, getPlacement, isEligible, student, getOrg, docs]
  );

  const sendChat = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsgId = Date.now().toString();
      const typingMsgId = (Date.now() + 1).toString();

      setChatMessages((prev) => [
        ...prev,
        { id: userMsgId, who: "me", text: trimmed },
        { id: typingMsgId, who: "INTERN", text: "···", isTyping: true },
      ]);

      setTimeout(() => {
        const reply = answerChat(trimmed);
        setChatMessages((prev) =>
          prev
            .filter((m) => m.id !== typingMsgId)
            .concat({
              id: Date.now().toString(),
              who: "INTERN",
              text: reply,
            })
        );
      }, 650);
    },
    [answerChat]
  );

  const askChat = useCallback(
    (text: string) => {
      sendChat(text);
    },
    [sendChat]
  );

  // Domain Actions
  const applyTo = useCallback(
    (id: string) => {
      const p = getPlacement(id);
      if (!p) return;
      const o = getOrg(p.orgId);
      const orgName = o ? o.name : "the organisation";

      openModal(
        `Apply with your pack — ${p.title}`,
        <div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--ink-2)",
              lineHeight: 1.65,
            }}
          >
            One click sends your statement, verified documents and eligibility
            check to <b>{orgName}</b>. The placement office confirms the record
            before the employer opens it.
          </p>
          <div
            style={{
              marginTop: "14px",
              border: "1px solid var(--rule)",
              padding: "12px",
              background: "#fff",
            }}
          >
            <div className="lbl">Statement</div>
            <p
              style={{
                fontSize: "12px",
                lineHeight: 1.6,
                marginTop: "5px",
              }}
            >
              {pack.statement}
            </p>
          </div>
          <div
            style={{
              marginTop: "12px",
              border: "1px solid var(--rule)",
            }}
          >
            {p.docs.map((d) => {
              const have = docs.find((x) => x.name === d);
              const isAttached = have && have.status !== "missing";
              return (
                <div
                  key={d}
                  className="file"
                  style={{ padding: "9px 11px" }}
                >
                  <span className="fi">{isAttached ? "✓" : "!"}</span>
                  <div>
                    <b>{d}</b>
                    <span>{have ? have.status : "will be requested"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>,
        "Send application",
        () => {
          toast(`Pack sent to ${orgName}`);
        }
      );
    },
    [getPlacement, getOrg, pack.statement, docs, openModal, toast]
  );

  const reviewStudent = useCallback(
    (name: string) => {
      openModal(
        `Student record — ${name}`,
        <div style={{ display: "grid", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
            }}
          >
            <span style={{ color: "var(--muted)" }}>Course</span>
            <b>Design · Year 3</b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
            }}
          >
            <span style={{ color: "var(--muted)" }}>CGPA</span>
            <b>3.7</b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
            }}
          >
            <span style={{ color: "var(--muted)" }}>Placement</span>
            <b>Product Design Intern</b>
          </div>
          <div
            style={{
              border: "1px solid var(--rule)",
              padding: "10px",
              marginTop: "6px",
            }}
          >
            {[
              "Transcript — verified",
              "Student ID — verified",
              "Portfolio — pending review",
            ].map((t) => (
              <div
                key={t}
                style={{ fontSize: "11.5px", padding: "4px 0" }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>,
        "Approve record",
        () => {
          setAdminQueue((prev) =>
            prev.map((item) =>
              item.n === name ? { ...item, st: "Ready", d: "3 of 3" } : item
            )
          );
          toast(`${name} approved for placement`);
        }
      );
    },
    [openModal, toast]
  );

  const editRequirements = useCallback(
    (id: string) => {
      const p = getPlacement(id);
      if (!p) return;

      openModal(
        `Requirements — ${p.title}`,
        <div className="form">
          <div className="field">
            <label>Eligible courses</label>
            <div className="checks">
              {COURSES.map((c) => (
                <label key={c}>
                  <input type="checkbox" defaultChecked={p.courses.includes(c)} />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div className="row2">
            <div className="field">
              <label>Minimum grade</label>
              <select defaultValue={p.grade}>
                {Object.keys(GRADE_RANK).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Testimonial required</label>
              <select
                defaultValue={p.testimonial ? "Required" : "Not required"}
              >
                <option value="Required">Required</option>
                <option value="Not required">Not required</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Required documents</label>
            <div className="checks">
              {[
                "Transcript",
                "Student ID",
                "National ID",
                "Recommendation letter",
                "Portfolio",
                "CV",
                "Writing sample",
                "Testimonial",
              ].map((d) => (
                <label key={d}>
                  <input
                    type="checkbox"
                    defaultChecked={p.docs.includes(d)}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>
        </div>,
        "Save requirements",
        () => {
          toast(`Requirements updated · ${p.title}`);
        }
      );
    },
    [getPlacement, openModal, toast]
  );

  const newPlacement = useCallback(() => {
    openModal(
      "New placement",
      <div className="form">
        <div className="row2">
          <div className="field">
            <label>Organisation type</label>
            <select id="npType" defaultValue="Company">
              <option>Company</option>
              <option>Government agency</option>
              <option>NGO</option>
              <option>University department</option>
            </select>
          </div>
          <div className="field">
            <label>Organisation</label>
            <select id="npOrg" defaultValue={orgs[0]?.id}>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} — {o.type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Placement title</label>
            <input placeholder="Data Analyst Intern" />
          </div>
          <div className="field">
            <label>Location</label>
            <input placeholder="Kampala" />
          </div>
        </div>
        <div className="row3">
          <div className="field">
            <label>Duration</label>
            <input placeholder="6 months" />
          </div>
          <div className="field">
            <label>Stipend</label>
            <input placeholder="UGX 1,200,000 / month" />
          </div>
          <div className="field">
            <label>Slots</label>
            <input type="number" defaultValue={4} />
          </div>
        </div>
        <div className="field">
          <label>Eligible courses</label>
          <div className="checks">
            {COURSES.map((c) => (
              <label key={c}>
                <input type="checkbox" />
                {c}
              </label>
            ))}
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Minimum grade</label>
            <select>
              {Object.keys(GRADE_RANK).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Closing date</label>
            <input type="date" />
          </div>
        </div>
        <div className="field">
          <label>Required documents</label>
          <div className="checks">
            {[
              "Transcript",
              "Student ID",
              "National ID",
              "Recommendation letter",
              "Portfolio",
              "CV",
              "Writing sample",
              "Testimonial",
            ].map((d) => (
              <label key={d}>
                <input type="checkbox" defaultChecked={d === "Transcript"} />
                {d}
              </label>
            ))}
          </div>
        </div>
      </div>,
      "Publish placement",
      () => {
        toast("Placement published · visible to eligible students");
      }
    );
  }, [openModal, orgs, toast]);

  const uploadDoc = useCallback(
    (name: string) => {
      setDocs((prev) => {
        const target = prev.find((x) => x.name === name) || prev[3];
        return prev.map((d) =>
          d === target
            ? {
                ...d,
                status: "pending",
                file: "recommendation-letter.pdf",
                size: "640 KB",
              }
            : d
        );
      });
      toast(`${name} uploaded · pending verification`);
    },
    [toast]
  );

  const setStatement = useCallback((statement: string) => {
    setPack((prev) => ({ ...prev, statement }));
  }, []);

  // Skills profile. Mutated on the student record so it persists across
  // dashboard views for the session; the backend will own this eventually.
  const setSkills = useCallback((skills: string[]) => {
    setStudent((prev) => ({ ...prev, skills }));
  }, []);

  const addSkill = useCallback((name: string) => {
    setStudent((prev) =>
      prev.skills.includes(name) ? prev : { ...prev, skills: [...prev.skills, name] }
    );
  }, []);

  const removeSkill = useCallback((name: string) => {
    setStudent((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== name),
    }));
  }, []);

  const toggleSkill = useCallback((name: string) => {
    setStudent((prev) => ({
      ...prev,
      skills: prev.skills.includes(name)
        ? prev.skills.filter((s) => s !== name)
        : [...prev.skills, name],
    }));
  }, []);

  const editPack = useCallback(() => {
    let currentVal = pack.statement;
    openModal(
      "Edit your statement",
      <div className="form">
        <div className="field">
          <label>Statement (max 600 characters)</label>
          <textarea
            id="packText"
            style={{ height: "140px" }}
            defaultValue={pack.statement}
            onChange={(e) => {
              currentVal = e.target.value;
            }}
          />
        </div>
        <div style={{ fontSize: "11px", color: "var(--muted)" }}>
          Used for every application. The placement title and closing date are
          appended automatically.
        </div>
      </div>,
      "Save statement",
      () => {
        setPack((prev) => ({ ...prev, statement: currentVal }));
        toast("Statement saved · pack updated");
      }
    );
  }, [pack.statement, openModal, toast]);

  const previewPack = useCallback(() => {
    const attached = docs.filter((d) => d.status !== "missing");
    openModal(
      "What the employer receives",
      <div style={{ border: "1px solid var(--rule)", padding: "16px", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <b style={{ fontSize: "14px" }}>Amina Nakato</b>
            <div style={{ fontSize: "11.5px", color: "var(--muted)" }}>
              Design · Makerere University · Year 3
            </div>
          </div>
          <span className="tg green">92% match</span>
        </div>
        <p style={{ fontSize: "12.5px", lineHeight: 1.65, marginTop: "12px" }}>
          {pack.statement}
        </p>
        <div style={{ borderTop: "1px solid var(--rule)", marginTop: "12px", paddingTop: "10px" }}>
          {attached.map((d) => (
            <div key={d.name} style={{ fontSize: "11px", padding: "3px 0" }}>
              ✓ {d.name} — {d.status}
            </div>
          ))}
        </div>
        <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "10px" }}>
          Sent from INTERN · placement reference appended automatically
        </div>
      </div>,
      null
    );
  }, [docs, pack.statement, openModal]);

  const showEmbed = useCallback(() => {
    openModal(
      "Career page embed",
      <div>
        <p style={{ fontSize: "12.5px", color: "var(--ink-2)", lineHeight: 1.65, marginBottom: "12px" }}>
          Paste this where your careers page should show live INTERN placements. It updates whenever you publish or close a placement.
        </p>
        <div className="embedpre">
          &lt;div id=&quot;intern-placements&quot;
          <br />
          &nbsp;&nbsp;data-org=<b>&quot;lumen-labs&quot;</b>
          <br />
          &nbsp;&nbsp;data-theme=<b>&quot;light&quot;</b>
          <br />
          &nbsp;&nbsp;data-limit=<b>&quot;6&quot;</b>&gt;&lt;/div&gt;
          <br />
          &lt;script src=<b>&quot;https://embed.intern.africa/v1.js&quot;</b>&gt;&lt;/script&gt;
          <button
            type="button"
            className="copybtn"
            onClick={() => toast("Snippet copied")}
          >
            Copy
          </button>
        </div>
        <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "10px" }}>
          Included in Premium and Enterprise. The free widget carries INTERN branding and caps at 10 roles.
        </div>
      </div>,
      "Done"
    );
  }, [openModal, toast]);

  const planAction = useCallback(
    (tier: string) => {
      if (tier === "Free" || tier === "Student") {
        toast("Free plan · no card required");
        go("signin");
        return;
      }
      if (
        tier === "Enterprise" ||
        tier === "Ministry" ||
        tier === "Consortium" ||
        tier === "Network"
      ) {
        go("contact");
        return;
      }

      openModal(
        `Start the ${tier} plan`,
        <div className="form">
          <div className="row2">
            <div className="field">
              <label>Organisation</label>
              <input placeholder="Lumen Labs" />
            </div>
            <div className="field">
              <label>Work email</label>
              <input placeholder="you@organisation.org" />
            </div>
          </div>
          <div className="row2">
            <div className="field">
              <label>Seats</label>
              <input placeholder="3" />
            </div>
            <div className="field">
              <label>Billing</label>
              <select>
                <option value="Card">Card</option>
                <option value="Invoice">Invoice</option>
              </select>
            </div>
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.6 }}>
            30-day trial. No charge until day 31, cancel from the dashboard at any time. Document verification is included in the trial.
          </div>
        </div>,
        "Start trial",
        () => {
          toast(`${tier} trial started · 30 days`);
        }
      );
    },
    [toast, go, openModal]
  );

  return (
    <AppContext.Provider
      value={{
        route,
        pid,
        typeFilter,
        sectorFilter,
        courseFilter,
        searchQuery,
        planSeg,
        role,
        dash,

        orgs,
        placements,
        student,
        docs,
        adminQueue,
        activity,
        pack,

        isMenuOpen,
        isSideDrawerOpen,
        toastMessage,
        modal,
        isChatOpen,
        chatMessages,

        setTypeFilter,
        setSectorFilter,
        setCourseFilter,
        setSearchQuery,
        setPlanSeg,
        setStatement,

        addSkill,
        removeSkill,
        toggleSkill,
        setSkills,

        go,
        openPlacement,
        setType,
        signIn,
        dashGo,

        openMenu,
        closeMenu,
        openSide,
        closeSide,
        toast,
        openModal,
        closeModal,
        modalConfirm,

        openChat,
        closeChat,
        sendChat,
        askChat,

        applyTo,
        reviewStudent,
        editRequirements,
        newPlacement,
        uploadDoc,
        editPack,
        previewPack,
        showEmbed,
        planAction,

        getOrg,
        getPlacement,
        isEligible,
        gradeRank,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
