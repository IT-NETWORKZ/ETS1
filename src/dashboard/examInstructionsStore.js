import { useEffect, useState } from "react";
import { EXAM_TYPES } from "./examTypesList";

const STORAGE_KEY = "examInstructionRecords_v1";
const EVENT_NAME = "examInstructionsUpdated";

const SEED_CONTENT = {
  "demo": "<p>This is a demo attempt meant only to show you how the platform works. Take your time exploring the timer, question palette and review screen — nothing here affects your score, history or subscription quota, and you can replay it as many times as you like.</p>",
  "quick-practice": "<p>A short, auto-picked set of questions for a fast self-check. Your result is shown immediately after submission. No certificate is issued for practice attempts.</p>",
  "custom-practice": "<p>Choose your subject, topic, difficulty, question count and duration before you begin. Explanations are shown immediately or after submission, depending on how you configure the practice set.</p>",
  "scheduled-normal": "<p>This exam is assigned by your organisation. Read every instruction on the start screen carefully — duration, marks, negative marking and navigation rules are fixed by the exam admin and cannot be changed once you begin.</p>",
  "scheduled-proctored": "<p>Your session will be monitored for integrity. Before the exam starts you must pass a camera, microphone and connection check, and remain visible in frame with your face unobstructed for the full duration.</p>",
  "public-open": "<p>Anyone with the shared link, code or QR can join this exam. Enter the exact code provided by the organiser. Result and certificate eligibility depend on how the organiser configured this exam.</p>",
};

function seedDefaults() {
  return EXAM_TYPES.map((t, i) => ({
    id: `seed-${t.id}`,
    examName: `${t.label} — Standard Instructions`,
    examType: t.id,
    content: SEED_CONTENT[t.id] || "",
    status: "enabled",
    updatedAt: Date.now() - (EXAM_TYPES.length - i) * 1000,
  }));
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedDefaults();
  } catch {
    return seedDefaults();
  }
}

function writeAll(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* localStorage unavailable — records stay in-memory for this session only */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function listInstructions() {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

// Creates a new record, or updates in place when record.id already exists.
export function upsertInstruction(record) {
  const all = readAll();
  const idx = all.findIndex((r) => r.id === record.id);
  const next =
    idx === -1
      ? [...all, { ...record, id: record.id || `ei-${Date.now()}`, updatedAt: Date.now() }]
      : all.map((r) => (r.id === record.id ? { ...r, ...record, updatedAt: Date.now() } : r));
  writeAll(next);
  return next;
}

export function setInstructionStatus(id, status) {
  const all = readAll();
  writeAll(all.map((r) => (r.id === id ? { ...r, status, updatedAt: Date.now() } : r)));
}

export function deleteInstruction(id) {
  writeAll(readAll().filter((r) => r.id !== id));
}

function subscribe(callback) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

// Full, live list of every instruction record — used by the Admin/Superadmin table.
export function useInstructionsList() {
  const [records, setRecords] = useState(listInstructions);
  useEffect(() => subscribe(() => setRecords(listInstructions())), []);
  return records;
}

// Enabled records for one exam type, live — used by the candidate exam-type pages.
export function useEnabledInstructions(examTypeId) {
  const [records, setRecords] = useState(() =>
    listInstructions().filter((r) => r.examType === examTypeId && r.status === "enabled")
  );
  useEffect(() => {
    const refresh = () =>
      setRecords(listInstructions().filter((r) => r.examType === examTypeId && r.status === "enabled"));
    refresh();
    return subscribe(refresh);
  }, [examTypeId]);
  return records;
}
