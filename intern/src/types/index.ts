import React from "react";

export type OrgType = "Company" | "Government" | "NGO" | "University" | "All";

export interface Org {
  id: string;
  name: string;
  type: string;
  sector: string;
  loc: string;
  seal: string;
  about: string;
}

export interface Placement {
  id: string;
  title: string;
  orgId: string;
  courses: string[];
  grade: string;
  loc: string;
  mode: string;
  duration: string;
  stipend: string;
  deadline: string;
  slots: number;
  status: "Open" | "Closing" | string;
  applicants: number;
  docs: string[];
  testimonial: boolean;
  about: string;
  duties: string[];
}

export interface GradRole {
  id: string;
  title: string;
  org: string;
  loc: string;
  pay: string;
  type: string;
  closes: string;
}

export interface Student {
  name: string;
  course: string;
  year: string;
  cgpa: number;
  uni: string;
}

export interface DocItem {
  name: string;
  status: "verified" | "pending" | "missing" | string;
  file: string;
  size: string;
}

export interface AdminQueueItem {
  n: string;
  i: string;
  c: string;
  y: string;
  p: string;
  d: string;
  st: "Review" | "Ready" | "Incomplete" | string;
}

export type ActivityItem = [string, string, string];

export interface PlanTier {
  name: string;
  price: string;
  per: string;
  desc: string;
  kind: "line" | "dark" | string;
  ribbon?: string;
  features: [string, 0 | 1][];
  cta: string;
}

export interface PlanSegment {
  label: string;
  intro: string;
  tiers: PlanTier[];
  table: [string, string, string, string][];
}

export interface ApplicationPack {
  statement: string;
  targets: string[];
}

export type UserRole = "student" | "jobseeker" | "employer" | "admin";

export type DashboardView =
  | "overview"
  | "placements"
  | "requirements"
  | "students"
  | "documents"
  | "pack"
  | "testimonial"
  | "roles"
  | "apps"
  | "applicants";

export interface ChatMessage {
  id: string;
  who: "INTERN" | "me";
  text: string;
  isTyping?: boolean;
}

export interface ModalConfig {
  title: string;
  body: React.ReactNode;
  okLabel?: string | null;
  onOk?: (() => void) | null;
}
