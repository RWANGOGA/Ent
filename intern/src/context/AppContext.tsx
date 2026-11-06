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
  Subscription,
  Portal,
} from "../types";
import {
  INITIAL_STUDENT,
  INITIAL_DOCS,
  INITIAL_ADMIN_QUEUE,
  ACTIVITY,
  INITIAL_PACK,
} from "../data";
import { matchPlacement, setSkillTables } from "../lib/skills";
import {
  activateSubscriptionApi,
  applyApi,
  askAdvisor,
  cancelSubscriptionApi,
  fetchCatalog,
  fetchCatalogMeta,
  fetchMe,
  fetchSaved,
  fetchSubscription,
  isApiEnabled,
  loginApi,
  registerApi,
  setToken,
  toggleSavedApi,
  type ApiUser,
  type CatalogMeta,
  type SubscriptionDto,
} from "../lib/api";

// Placement-fee model. Free host organisations (seed org "o4") publish up to
// this many placements, then the fee applies. Mirrors the site's "first three
// placements free" promise and turns it into enforced behaviour.
const FREE_ALLOWANCE = 3;
const SUBSCRIPTION_KEY = "intern:subscription";

// The empty catalogue-meta shape. The UI renders nothing derived from it until
// GET /placements/meta fills it — there is no bundled fallback table.
const EMPTY_META: CatalogMeta = {
  courses: [],
  orgTypes: [],
  locations: [],
  gradeRules: {},
  requiredSkills: {},
  skills: [],
};

// Maps the backend subscription DTO onto the UI's Subscription shape.
function toLocalSubscription(s: SubscriptionDto): Subscription {
  return {
    plan: s.plan,
    billing: s.billing === "Invoice" ? "Invoice" : s.billing === "Card" ? "Card" : "",
    seats: s.seats,
    since: s.since,
  };
}

// The four dashboards are selected by an account's role. Guard against a bad
// value from the API so role-dependent lookups stay total.
function mapApiRole(r: string): UserRole {
  return r === "jobseeker" || r === "employer" || r === "admin" ? r : "student";
}

interface AppContextType {
  route: string;
  portal: Portal;
  pid: string | null;
  typeFilter: string;
  sectorFilter: string;
  courseFilter: string;
  searchQuery: string;
  planSeg: string;
  role: UserRole;
  dash: DashboardView;
  session: ApiUser | null;
  isAuthed: boolean;
  authReady: boolean;

  // Data
  orgs: Org[];
  placements: Placement[];
  meta: CatalogMeta;
  metaReady: boolean;
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
  enterPortal: (portal: Portal) => void;
  openPlacement: (id: string) => void;
  setType: (t: string) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    name: string,
    role: UserRole,
    password: string
  ) => Promise<void>;
  signOut: () => void;
  openDashboardFor: (r: UserRole) => void;
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

  // Billing / placement fees
  subscription: Subscription;
  isPremium: boolean;
  freeAllowance: number;
  employerLiveCount: number;
  activatePlan: (
    plan: string,
    billing: "Card" | "Invoice",
    seats: number
  ) => void;
  cancelPlan: () => void;

  // Saved placements (bookmark, persisted to localStorage)
  saved: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;

  // Helpers
  getOrg: (id: string) => Org | undefined;
  getPlacement: (id: string) => Placement | undefined;
  isEligible: (p: Placement) => boolean;
  gradeRank: (g: string) => number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<string>("home");
  const [portal, setPortal] = useState<Portal>("internships");
  const [pid, setPid] = useState<string | null>("p1");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [sectorFilter, setSectorFilter] = useState<string>("All");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [planSeg, setPlanSeg] = useState<string>("companies");
  const [role, setRole] = useState<UserRole>("student");
  const [dash, setDash] = useState<DashboardView>("overview");
  // The signed-in account (id/email/name/role). Null until /auth/me or a login
  // resolves. It is the single source of identity for the whole app now.
  const [session, setSession] = useState<ApiUser | null>(null);
  // True once the initial /auth/me check has finished, so we never flash a
  // "not signed in" redirect while the stored session is still being restored.
  const [authReady, setAuthReady] = useState<boolean>(false);

  // Catalogue comes only from the API now — no bundled seed fallback — so it
  // starts empty and fills from GET /placements on mount.
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  // Catalogue metadata (courses/types/locations for filters, grade thresholds,
  // skill taxonomy, per-placement requirements) — served by GET
  // /placements/meta. Starts empty for the same reason as the catalog.
  const [meta, setMeta] = useState<CatalogMeta>(EMPTY_META);
  const [metaReady, setMetaReady] = useState<boolean>(false);
  const [student, setStudent] = useState<Student>(INITIAL_STUDENT);
  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [adminQueue, setAdminQueue] = useState<AdminQueueItem[]>(INITIAL_ADMIN_QUEUE);
  const [activity, setActivity] = useState<ActivityItem[]>(ACTIVITY);
  const [pack, setPack] = useState<ApplicationPack>(INITIAL_PACK);

  // Billing. Free host organisations publish up to FREE_ALLOWANCE placements,
  // then a placement fee unlocks unlimited posting. Persisted so refreshing
  // keeps the plan; in Phase 2 the FastAPI backend owns this record.
  const [subscription, setSubscription] = useState<Subscription>({
    plan: "Free",
    billing: "",
    seats: 1,
    since: "",
  });

  // Bookmarked placements. Persisted so the shortlist survives reloads and is
  // shared across the public index, the card button and the dashboard.
  const [saved, setSaved] = useState<string[]>([]);

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

  const gradeRank = useCallback(
    (g: string) => meta.gradeRules[g] || 0,
    [meta]
  );

  const isEligible = useCallback(
    (p: Placement) => {
      return (
        p.courses.includes(student.course) &&
        student.cgpa >= (meta.gradeRules[p.grade] || 0)
      );
    },
    [student, meta]
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
      setPortal("internships");
    } else if (raw === "internships" || raw.startsWith("internships-")) {
      setPortal("internships");
      setRoute(raw === "internships" ? "internships" : raw.slice("internships-".length));
    } else if (raw === "jobs" || raw.startsWith("jobs-")) {
      setPortal("jobs");
      setRoute(raw === "jobs" ? "jobs" : raw.slice("jobs-".length));
    } else if (raw.startsWith("dashboard")) {
      const parts = raw.split("-");
      const r = (parts[1] as UserRole) || "student";
      const d = (parts[2] as DashboardView) || "overview";
      setRole(r);
      setDash(d);
      setPortal(r === "jobseeker" ? "jobs" : "internships");
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

  // Catalog read: the placements and organisations come from the database via
  // GET /placements. There is no seed fallback, so the catalogue is only ever
  // what the backend reports (empty when the API isn't configured/reachable).
  useEffect(() => {
    if (!isApiEnabled) return;
    let cancelled = false;
    fetchCatalog()
      .then(({ placements: fromApi, orgs: apiOrgs }) => {
        if (cancelled) return;
        setPlacements(fromApi);
        setOrgs(apiOrgs);
      })
      .catch(() => {
        /* backend unreachable — the catalogue is simply empty */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Catalogue metadata read: GET /placements/meta. The filter values and the
  // matching tables (grade thresholds, skill taxonomy, per-placement required
  // skills) are the ones the backend domain owns; feeding them to setSkillTables
  // keeps the local scorer at parity with the server without any bundled copy.
  useEffect(() => {
    if (!isApiEnabled) {
      setMetaReady(true);
      return;
    }
    let cancelled = false;
    fetchCatalogMeta()
      .then((m) => {
        if (cancelled) return;
        setMeta(m);
        setSkillTables(m);
      })
      .catch(() => {
        /* backend unreachable — filters and scoring degrade to empty tables */
      })
      .finally(() => {
        if (!cancelled) setMetaReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Restore the session once from a stored token. /auth/me is the anchor: it
  // both validates the token and returns the account whose role drives which
  // dashboard the user sees.
  useEffect(() => {
    if (!isApiEnabled) {
      setAuthReady(true);
      return;
    }
    fetchMe()
      .then((user) => {
        if (user) {
          setSession(user);
          setRole(mapApiRole(user.role));
        }
      })
      .finally(() => setAuthReady(true));
  }, []);

  // The dashboard now requires a real, signed-in account: if the session has
  // resolved to nothing and a dashboard is opened (deep link included), route to
  // the sign-in screen instead of showing an identity-less dashboard.
  useEffect(() => {
    if (
      isApiEnabled &&
      authReady &&
      !session &&
      route === "dashboard" &&
      typeof window !== "undefined"
    ) {
      window.location.hash = "#signin";
      setRoute("signin");
    }
  }, [isApiEnabled, authReady, session, route]);

  const go = useCallback(
    (newRoute: string) => {
      closeMenu();
      setRoute(newRoute);
      if (newRoute === "internships" || newRoute === "placements" || newRoute === "placement") {
        setPortal("internships");
      } else if (newRoute === "jobs") {
        setPortal("jobs");
      }
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

  const enterPortal = useCallback((nextPortal: Portal) => {
    setPortal(nextPortal);
    setRoute(nextPortal);
    if (typeof window !== "undefined") {
      window.location.hash = `#${nextPortal}`;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

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

  const openDashboardFor = useCallback((r: UserRole) => {
    setDash("overview");
    setRoute("dashboard");
    setPortal(r === "jobseeker" ? "jobs" : "internships");
    if (typeof window !== "undefined") {
      window.location.hash = `#dashboard-${r}-overview`;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // Real login: authenticate against the backend, persist the Bearer token, and
  // let the account's own role drive which dashboard opens. Throws on failure
  // so the sign-in screen can surface the backend's error message.
  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!isApiEnabled) throw new Error("Sign-in needs the backend API.");
      const user = await loginApi(email, password);
      const r = mapApiRole(user.role);
      setSession(user);
      setRole(r);
      if (r === "student") setStudent((prev) => ({ ...prev, name: user.name }));
      openDashboardFor(r);
    },
    [openDashboardFor]
  );

  const signUp = useCallback(
    async (
      email: string,
      name: string,
      userRole: UserRole,
      password: string
    ) => {
      if (!isApiEnabled) throw new Error("Sign-up needs the backend API.");
      const user = await registerApi(email, name, userRole, password);
      const r = mapApiRole(user.role);
      setSession(user);
      setRole(r);
      if (r === "student") setStudent((prev) => ({ ...prev, name: user.name }));
      openDashboardFor(r);
    },
    [openDashboardFor]
  );

  const signOut = useCallback(() => {
    setToken(null);
    setSession(null);
    setSaved([]);
    go("home");
  }, [go]);

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

      // Skills-driven career guidance. These run first because the product's
      // core claim is advising from the student's actual profile, not generic
      // FAQs. Deterministic for now; the FastAPI advisor will reuse the same
      // matchPlacement() output.
      const ranked = placements
        .map((p) => ({
          p,
          m: matchPlacement(p, student.skills, student.course, student.cgpa),
        }))
        .sort((a, b) => b.m.score - a.m.score);

      // Which missing skill unlocks the most placements the student could
      // realistically land (course + grade already fit).
      const skillImpact = (): { skill: string; count: number }[] => {
        const have = new Set(student.skills);
        const tally = new Map<string, number>();
        for (const { p, m } of ranked) {
          if (!m.courseFit || !m.gradeFit) continue;
          for (const miss of m.missing) {
            if (have.has(miss)) continue;
            tally.set(miss, (tally.get(miss) || 0) + 1);
          }
        }
        return [...tally.entries()]
          .map(([skill, count]) => ({ skill, count }))
          .sort((a, b) => b.count - a.count);
      };

      if (
        q.includes("learn") ||
        q.includes("skill") ||
        q.includes("improve") ||
        q.includes("gap") ||
        q.includes("boost") ||
        q.includes("stronger") ||
        q.includes("increase")
      ) {
        const impact = skillImpact();
        if (!impact.length) {
          const top = ranked[0];
          return `Your profile already covers every required skill for your best fit${
            top ? ` (<b>${top.p.title}</b> at ${top.m.score}% match)` : ""
          }. To widen your options, add adjacent skills on your Skills profile — pick a placement you cannot reach yet and learn the skills its row lists as missing.`;
        }
        const lead = impact.slice(0, 2);
        return `Based on your record (${student.skills.length} skills, ${
          student.course
        }, CGPA ${student.cgpa}), the fastest wins are: ${lead
          .map(
            (i) =>
              `<b>${i.skill}</b> (unlocks ${i.count} placement${
                i.count > 1 ? "s" : ""
              } you already clear on course and grade)`
          )
          .join(", ")}. Add ${
          lead[0].skill
        } to your Skills profile and watch those match scores jump. Paste a project or CV line into the extractor if you have used it before — it will claim the skill for you.`;
      }

      if (
        q.includes("best") ||
        q.includes("recommend") ||
        q.includes("where do i fit") ||
        q.includes("most match") ||
        q.includes("top match") ||
        q.includes("should i apply") ||
        q.includes("fits me") ||
        q.includes("good for me") ||
        q.includes("which placement")
      ) {
        const top = ranked[0];
        if (!top)
          return `Ask about a specific role and I will score it against your skills, course and grade.`;
        const org = getOrg(top.p.orgId);
        const near = ranked[1];
        const gapText = top.m.missing.length
          ? ` The only skills you are missing there: ${top.m.missing.join(
              ", "
            )}.`
          : ` You already match every skill it asks for.`;
        return `Your strongest fit right now is <b>${top.p.title}</b> at ${
          org?.name || "a host organisation"
        } — ${top.m.score}% match, closing ${top.p.deadline}.${gapText}${
          near
            ? ` Next best is ${near.p.title} at ${near.m.score}%.`
            : ""
        } Open your Placements tab to see the full ranking, or the Skills profile to close that gap and re-score.`;
      }

      if (
        q.includes("match") ||
        q.includes("score") ||
        q.includes("how are you ranking") ||
        q.includes("how do you calculate")
      ) {
        return `Match is weighted: your skill coverage of a placement's required skills is 60%, whether your course (${student.course}) is on its list is 25%, and whether your CGPA (${student.cgpa}) clears its minimum grade is 15%. It is fully explainable — every placement row lists the skills it needs and the exact ones you already bring. Nothing is a black box, and when the advisor moves server-side the same score is what the API returns.`;
      }

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
          placements[1] ||
          placements[0];

        const targetP = found;
        if (!targetP)
          return `The placement catalog has not loaded yet, so I cannot score eligibility. Open the Placements tab and ask again once the live list appears.`;
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

      return `I can rank placements against your skills and tell you which one fits best, name the single skill that would unlock the most roles for you, check your eligibility for a specific placement, list the documents you still need, or show the next deadlines. Ask about a role or say "what should I learn" and I will use your actual profile.`;
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

      const finalize = (reply: string) =>
        setChatMessages((prev) =>
          prev
            .filter((m) => m.id !== typingMsgId)
            .concat({
              id: Date.now().toString(),
              who: "INTERN",
              text: reply,
            })
        );

      // Prefer the Groq advisor (grounded by the server-side matcher). If the
      // API is off/unreachable or Groq isn't configured (503), fall back to the
      // built-in deterministic assistant so the chat always answers.
      if (isApiEnabled) {
        askAdvisor(trimmed, student.skills, student.course, student.cgpa)
          .then(finalize)
          .catch(() => finalize(answerChat(trimmed)));
        return;
      }

      setTimeout(() => finalize(answerChat(trimmed)), 650);
    },
    [answerChat, student]
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
          if (!isApiEnabled) {
            toast(`Pack sent to ${orgName}`);
            return;
          }
          if (!session) {
            toast("Please sign in to apply.");
            go("signin");
            return;
          }
          applyApi(id, pack.statement)
            .then(() => toast(`Application sent to ${orgName}`))
            .catch(() => toast("Couldn't submit right now — please try again"));
        }
      );
    },
    [getPlacement, getOrg, pack.statement, docs, openModal, toast, session, go]
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
              {meta.courses.map((c) => (
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
                {Object.keys(meta.gradeRules).map((g) => (
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

  // Billing actions and derived state. Declared before the domain actions so
  // newPlacement's placement-fee gate can read them.
  const isPremium = subscription.plan !== "Free";
  const employerLiveCount = placements.filter(
    (p) => p.orgId === session?.org_id
  ).length;

  const activatePlan = useCallback(
    (plan: string, billing: "Card" | "Invoice", seats: number) => {
      const optimistic: Subscription = {
        plan,
        billing,
        seats: Math.max(1, seats),
        since: new Date().toISOString().slice(0, 10),
      };
      setSubscription(optimistic);
      toast(`${plan} plan active · placement fee applied`);
      if (!isApiEnabled) return;
      activateSubscriptionApi(plan, billing, Math.max(1, seats))
        .then((s) => setSubscription(toLocalSubscription(s)))
        .catch(() => {
          /* server unreachable — keep the optimistic plan for this session */
        });
    },
    [toast]
  );

  const cancelPlan = useCallback(() => {
    setSubscription({ plan: "Free", billing: "", seats: 1, since: "" });
    toast("Moved to Free · posting capped at 3 placements");
    if (!isApiEnabled) return;
    cancelSubscriptionApi()
      .then((s) => setSubscription(toLocalSubscription(s)))
      .catch(() => {
        /* server unreachable — keep the optimistic Free plan */
      });
  }, [toast]);

  // Hydrate the live plan once: from the API when configured, otherwise from
  // localStorage. When the API owns the record we don't mirror to storage.
  useEffect(() => {
    if (isApiEnabled) {
      // The org is derived from the Bearer token, so hydrate the plan only for a
      // signed-in employer. Other roles have no subscription record to load.
      if (!session || session.role !== "employer" || !session.org_id) return;
      fetchSubscription()
        .then((s) => setSubscription(toLocalSubscription(s)))
        .catch(() => {
          /* backend unreachable — fall back to any stored plan */
          try {
            const raw = window.localStorage.getItem(SUBSCRIPTION_KEY);
            if (raw) setSubscription(JSON.parse(raw) as Subscription);
          } catch {
            /* ignore */
          }
        });
      return;
    }
    try {
      const raw = window.localStorage.getItem(SUBSCRIPTION_KEY);
      if (raw) setSubscription(JSON.parse(raw) as Subscription);
    } catch {
      /* ignore malformed storage */
    }
  }, [session]);

  useEffect(() => {
    if (isApiEnabled) return; // the database is the source of truth
    try {
      window.localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    } catch {
      /* storage may be unavailable (private mode) — plan still works in-session */
    }
  }, [subscription]);

  const toggleSave = useCallback(
    (id: string) => {
      if (!isApiEnabled) return;
      if (!session) {
        toast("Sign in to save placements.");
        go("signin");
        return;
      }
      // Optimistic flip, then reconcile with the server's authoritative list.
      setSaved((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
      toggleSavedApi(id)
        .then(({ savedIds }) => setSaved(savedIds))
        .catch(() => {
          /* server unreachable — keep the optimistic local change */
        });
    },
    [session, toast, go]
  );

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  // The shortlist is per-account and comes only from the API. It re-hydrates
  // whenever the signed-in account changes (login, logout, switch).
  useEffect(() => {
    if (!isApiEnabled) return;
    if (!session) {
      setSaved([]);
      return;
    }
    fetchSaved()
      .then(setSaved)
      .catch(() => setSaved([]));
  }, [session]);

  const openNewPlacementForm = useCallback(() => {
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
            <select id="npOrg" defaultValue={session?.org_id || orgs[0]?.id || ""}>
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
            <input id="npTitle" placeholder="Data Analyst Intern" />
          </div>
          <div className="field">
            <label>Location</label>
            <input id="npLoc" placeholder="Kampala" />
          </div>
        </div>
        <div className="row3">
          <div className="field">
            <label>Duration</label>
            <input id="npDuration" placeholder="6 months" />
          </div>
          <div className="field">
            <label>Stipend</label>
            <input id="npStipend" placeholder="UGX 1,200,000 / month" />
          </div>
          <div className="field">
            <label>Slots</label>
            <input id="npSlots" type="number" defaultValue={4} />
          </div>
        </div>
        <div className="field">
          <label>Eligible courses</label>
          <div className="checks" id="npCourses">
            {meta.courses.map((c) => (
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
            <select id="npGrade">
              {Object.keys(meta.gradeRules).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Closing date</label>
            <input id="npDeadline" type="date" />
          </div>
        </div>
        <div className="field">
          <label>Required documents</label>
          <div className="checks" id="npDocs">
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
        const val = (id: string) =>
          (document.getElementById(id) as HTMLInputElement | null)?.value?.trim() ||
          "";
        const checked = (containerId: string) => {
          const el = document.getElementById(containerId);
          if (!el) return [] as string[];
          return Array.from(
            el.querySelectorAll('input[type="checkbox"]:checked')
          ).map(
            (cb) =>
              (cb.closest("label")?.textContent || "").trim()
          );
        };

        const title = val("npTitle") || "Untitled placement";
        const orgId =
          (document.getElementById("npOrg") as HTMLSelectElement | null)?.value ||
          session?.org_id ||
          orgs[0]?.id ||
          "";
        const grade =
          (document.getElementById("npGrade") as HTMLSelectElement | null)
            ?.value || "B";

        const placement: Placement = {
          id: `p${Date.now()}`,
          title,
          orgId,
          courses: checked("npCourses"),
          grade,
          loc: val("npLoc") || "Kampala",
          mode: "On-site",
          duration: val("npDuration") || "6 months",
          stipend: val("npStipend") || "Unpaid",
          deadline: val("npDeadline") || "—",
          slots: Number(val("npSlots")) || 1,
          status: "Open",
          applicants: 0,
          docs: checked("npDocs"),
          testimonial: false,
          about: `Newly published ${title.toLowerCase()} listing.`,
          duties: [],
        };

        setPlacements((prev) => [placement, ...prev]);
        toast(`${title} published · visible to eligible students`);
      }
    );
  }, [openModal, orgs, session, toast]);

  const newPlacement = useCallback(() => {
    // Placement fee gate: free hosts publish up to FREE_ALLOWANCE, then pay.
    if (!isPremium && employerLiveCount >= FREE_ALLOWANCE) {
      openModal(
        `Placement fee · ${FREE_ALLOWANCE} free listings used`,
        <div className="form">
          <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.6 }}>
            Your organisation has published its {FREE_ALLOWANCE} free placements.
            Additional listings require a placement fee. Students never pay —
            employers fund verification, search and reporting.
          </p>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.6 }}>
            Current plan: <b>{subscription.plan}</b>. Activating a plan unlocks
            unlimited postings and is billed per seat.
          </div>
        </div>,
        "Unlock unlimited postings",
        () => {
          activatePlan("Growth", "Card", 3);
          openNewPlacementForm();
        }
      );
      return;
    }
    openNewPlacementForm();
  }, [
    isPremium,
    employerLiveCount,
    subscription.plan,
    openModal,
    activatePlan,
    openNewPlacementForm,
  ]);


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
        cancelPlan();
        go("signin");
        return;
      }
      if (
        tier === "Enterprise" ||
        tier === "Ministry" ||
        tier === "Consortium" ||
        tier === "Network"
      ) {
        // High-touch sales tiers are quoted, not self-served.
        go("contact");
        return;
      }

      openModal(
        `Start the ${tier} plan`,
        <div className="form">
          <div className="row2">
            <div className="field">
              <label>Organisation</label>
              <input id="planOrg" placeholder="Lumen Labs" />
            </div>
            <div className="field">
              <label>Work email</label>
              <input id="planEmail" placeholder="you@organisation.org" />
            </div>
          </div>
          <div className="row2">
            <div className="field">
              <label>Seats</label>
              <input id="planSeats" type="number" min={1} defaultValue={3} />
            </div>
            <div className="field">
              <label>Billing</label>
              <select id="planBilling" defaultValue="Card">
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
          const seats = Number(
            (document.getElementById("planSeats") as HTMLInputElement | null)?.value
          );
          const billing = (document.getElementById(
            "planBilling"
          ) as HTMLSelectElement | null)?.value === "Invoice"
            ? "Invoice"
            : "Card";
          activatePlan(tier, billing, Number.isFinite(seats) ? seats : 1);
        }
      );
    },
    [toast, go, openModal, cancelPlan, activatePlan]
  );

  return (
    <AppContext.Provider
      value={{
        route,
        portal,
        pid,
        typeFilter,
        sectorFilter,
        courseFilter,
        searchQuery,
        planSeg,
        role,
        dash,
        session,
        isAuthed: !!session,
        authReady,

        orgs,
        placements,
        meta,
        metaReady,
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
        enterPortal,
        openPlacement,
        setType,
        signIn,
        signUp,
        signOut,
        openDashboardFor,
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

        subscription,
        isPremium,
        freeAllowance: FREE_ALLOWANCE,
        employerLiveCount,
        activatePlan,
        cancelPlan,

        saved,
        toggleSave,
        isSaved,

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
