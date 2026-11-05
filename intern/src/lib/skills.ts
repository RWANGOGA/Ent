import { Placement } from "../types";
import { GRADE_RANK } from "../data";

/*
  Skills-to-opportunity matching.

  This is the product's core claim, and it is deliberately frontend-only for
  now: the extractor is a deterministic keyword matcher over a curated
  taxonomy, so a student can paste projects or CV text and see real skills
  surface without a backend. When the FastAPI advisor lands, only the engine
  behind extractSkills() is swapped for a model — the data shapes and this
  module's public functions stay identical.
*/

export interface Skill {
  name: string;
  category: string;
  // Lower-cased surface forms. A skill is claimed when any appears on a word
  // boundary in the pasted text, or is added by hand.
  keywords: string[];
}

export const SKILLS: Skill[] = [
  // Design & UX
  { name: "Figma", category: "Design", keywords: ["figma"] },
  { name: "UI Design", category: "Design", keywords: ["ui design", "ui/ux", "interface design", "mockup"] },
  { name: "UX Research", category: "Design", keywords: ["ux research", "usability test", "user interview", "user research"] },
  { name: "Prototyping", category: "Design", keywords: ["prototype", "prototyping", "wireframe"] },
  { name: "Design Systems", category: "Design", keywords: ["design system", "component library", "style guide"] },
  { name: "Brand Identity", category: "Design", keywords: ["brand", "branding", "logo", "visual identity"] },
  { name: "Typography", category: "Design", keywords: ["typography", "type setting", "font"] },
  { name: "Illustrator", category: "Design", keywords: ["illustrator", "photoshop", "adobe", "affinity"] },

  // Engineering
  { name: "JavaScript", category: "Engineering", keywords: ["javascript", "js", "es6"] },
  { name: "TypeScript", category: "Engineering", keywords: ["typescript", "ts"] },
  { name: "React", category: "Engineering", keywords: ["react", "reactjs", "next.js", "nextjs"] },
  { name: "Node.js", category: "Engineering", keywords: ["node", "nodejs", "express"] },
  { name: "Python", category: "Engineering", keywords: ["python", "django", "flask", "fastapi"] },
  { name: "Git", category: "Engineering", keywords: ["git", "github", "version control"] },
  { name: "APIs", category: "Engineering", keywords: ["api", "rest", "graphql", "endpoint"] },
  { name: "Testing", category: "Engineering", keywords: ["test", "testing", "jest", "unit test", "qa"] },

  // Data
  { name: "SQL", category: "Data", keywords: ["sql", "postgres", "mysql", "query", "database"] },
  { name: "Excel", category: "Data", keywords: ["excel", "spreadsheet", "google sheets"] },
  { name: "Data Cleaning", category: "Data", keywords: ["data cleaning", "data wrangling", "etl", "preprocess"] },
  { name: "Dashboards", category: "Data", keywords: ["dashboard", "tableau", "power bi", "looker", "data studio"] },
  { name: "Statistics", category: "Data", keywords: ["statistic", "regression", "hypothesis", "r ", "spss", "sampling"] },
  { name: "Data Analysis", category: "Data", keywords: ["data analysis", "analytics", "pandas", "numpy", "insight"] },

  // Policy, research & programmes
  { name: "Policy Analysis", category: "Research", keywords: ["policy", "legislation", "regulation", "bill"] },
  { name: "Research", category: "Research", keywords: ["research", "literature review", "survey", "study"] },
  { name: "Report Writing", category: "Research", keywords: ["report writing", "brief", "memo", "documentation", "write-up"] },
  { name: "Stakeholder Engagement", category: "Research", keywords: ["stakeholder", "community", "consultation", "coordination"] },
  { name: "Monitoring & Evaluation", category: "Research", keywords: ["monitoring", "evaluation", "m&e", "indicator", "logframe", "theory of change"] },

  // Health
  { name: "Health Informatics", category: "Health", keywords: ["health informatics", "electronic health", "ehr", "patient data"] },
  { name: "Patient Records", category: "Health", keywords: ["patient record", "clinical record", "medical record", "triage"] },

  // Communication & brand
  { name: "Copywriting", category: "Communication", keywords: ["copywriting", "content writing", "copy", "blog"] },
  { name: "Communication", category: "Communication", keywords: ["communication", "presentation", "public speaking", "storytelling"] },

  // Professional
  { name: "Problem Solving", category: "Professional", keywords: ["problem solving", "problem-solving", "analytical thinking"] },
  { name: "Teamwork", category: "Professional", keywords: ["teamwork", "collaboration", "team lead", "agile", "scrum"] },
];

export const SKILL_NAMES: string[] = SKILLS.map((s) => s.name);

export const SKILL_BY_NAME: Record<string, Skill> = Object.fromEntries(
  SKILLS.map((s) => [s.name, s])
);

// Curated requirements per placement. Keyed by id so the 12 seed placements do
// not each need a new field; the backend will own this table later.
export const REQUIRED_SKILLS: Record<string, string[]> = {
  p1: ["Figma", "UI Design", "Prototyping", "Design Systems"],
  p2: ["SQL", "Excel", "Data Cleaning", "Dashboards", "Statistics"],
  p3: ["Python", "JavaScript", "Git", "SQL", "APIs"],
  p4: ["Health Informatics", "Patient Records", "Data Cleaning"],
  p5: ["JavaScript", "React", "TypeScript", "Git"],
  p6: ["Policy Analysis", "Research", "Report Writing"],
  p7: ["SQL", "Dashboards", "Data Analysis", "Python"],
  p8: ["Data Analysis", "Report Writing", "Research", "Excel"],
  p9: ["Stakeholder Engagement", "Report Writing", "Monitoring & Evaluation"],
  p10: ["UX Research", "Research", "Prototyping", "Statistics"],
  p11: ["Brand Identity", "Typography", "Illustrator", "Copywriting"],
  p12: ["Monitoring & Evaluation", "Data Analysis", "Report Writing", "Statistics"],
};

export function requiredSkillsFor(p: Placement): string[] {
  return REQUIRED_SKILLS[p.id] || [];
}

/*
  Deterministic skill extraction. Returns skills found in the text, in
  taxonomy order. Whole-word-ish matching on the lower-cased haystack avoids
  "js" firing inside "adjust".
*/
export function extractSkills(text: string): string[] {
  const hay = ` ${text.toLowerCase()} `;
  const found: string[] = [];
  for (const skill of SKILLS) {
    const hit = skill.keywords.some((kw) => {
      const needle = kw.toLowerCase();
      // Keyword already carries surrounding space where it matters (e.g. "r ").
      const idx = hay.indexOf(needle);
      if (idx === -1) return false;
      const before = hay[idx - 1];
      const after = hay[idx + needle.length];
      const leftOk = before === undefined || /[^a-z0-9]/.test(before);
      const rightOk = after === undefined || /[^a-z0-9]/.test(after) || needle.endsWith(" ");
      return leftOk && rightOk;
    });
    if (hit) found.push(skill.name);
  }
  return found;
}

export interface MatchResult {
  score: number; // 0-100
  matched: string[]; // required skills the student has
  missing: string[]; // required skills the student lacks
  courseFit: boolean;
  gradeFit: boolean;
}

/*
  Weighted match: skill coverage dominates, then the course and grade gates
  that already existed as a boolean. Deliberately explainable — every term the
  score is built from is returned so the UI can say "why".
*/
export function matchPlacement(
  p: Placement,
  studentSkills: string[],
  studentCourse: string,
  studentCgpa: number
): MatchResult {
  const required = requiredSkillsFor(p);
  const have = new Set(studentSkills);
  const matched = required.filter((s) => have.has(s));
  const missing = required.filter((s) => !have.has(s));

  const coverage = required.length === 1 ? (matched.length ? 1 : 0) : required.length ? matched.length / required.length : 0;

  const courseFit = p.courses.includes(studentCourse);
  const threshold = GRADE_RANK[p.grade] ?? 0;
  const gradeFit = studentCgpa >= threshold;

  // Weights: skills 60%, course 25%, grade 15%.
  const raw = coverage * 0.6 + (courseFit ? 0.25 : 0) + (gradeFit ? 0.15 : 0);
  const score = Math.round(raw * 100);

  return { score, matched, missing, courseFit, gradeFit };
}
